# judge.py
import subprocess
import tempfile
import json
from pathlib import Path
import re

TESTS = [
    [5, 3, 8, 1, 2],
    [10, 9, 8, 7],
    [2, 5, 1, 4, 3],
    [],
    [100, -1, 50, 0],
]


def correct(x):
    return sorted(x)


# ============================================================
# PYTHON JUDGE  (VS Code–Style Error Output)
# ============================================================
def judge_python(code: str):

    harness = f"""
import json
import traceback
from student import my_sort

TESTS = {TESTS}

try:
    results = []
    for t in TESTS:
        out = my_sort(list(t))
        results.append(out)

    print(json.dumps({{"results": results}}))

except Exception:
    tb = traceback.format_exc()

    import re
    line = None
    col = None
    snippet = None

    # Extract line number
    m = re.search(r'student\\\\.py", line (\\\\d+)', tb)
    if m:
        line = int(m.group(1))

    # Extract snippet + caret column
    m2 = re.search(r'File "student\\\\.py", line \\\\d+\\n(.*)\\n(\\s*\\^)', tb)
    if m2:
        snippet = m2.group(1)
        caret = m2.group(2)
        col = len(caret)

    message = tb.strip().split("\\n")[-1]

    print(json.dumps({{
        "status": "error",
        "diagnostics": {{
            "message": message,
            "line": line,
            "column": col,
            "severity": "error",
            "snippet": snippet
        }},
        "traceback": tb
    }}))
"""

    # --------------------------------------------------------
    # Execute Python student code in temp folder
    # --------------------------------------------------------
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)

        (tmp / "student.py").write_text(code)
        (tmp / "run.py").write_text(harness)

        try:
            proc = subprocess.run(
                ["python", "run.py"],
                cwd=tmp,
                capture_output=True,
                text=True,
                timeout=3
            )
        except subprocess.TimeoutExpired:
            return {"status": "error", "diagnostics": {"message": "Time Limit Exceeded"}}

        try:
            data = json.loads(proc.stdout)
        except:
            return {"status": "error", "diagnostics": {"message": "Invalid output"}}

        if data.get("status") == "error":
            return data

        # Compare results
        for inp, out in zip(TESTS, data["results"]):
            exp = correct(inp)
            if out != exp:
                return {
                    "status": "wrong",
                    "input": inp,
                    "output": out,
                    "expected": exp
                }

        return {"status": "ok"}


# ============================================================
# C++ JUDGE (VS Code–Style Error Output)
# ============================================================
CPP_TEMPLATE = """
#include <bits/stdc++.h>
using namespace std;

{user_code}

int main() {{
    vector<vector<int>> tests = {tests};
    for (auto &t : tests) {{
        auto out = mySort(t);
        cout << out.size();
        for (int x : out) cout << " " << x;
        cout << "\\n";
    }}
}}
"""


def judge_cpp(code: str):

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)

        (tmp / "main.cpp").write_text(
            CPP_TEMPLATE.format(user_code=code, tests=TESTS)
        )

        # ----------------------------------------------------
        # COMPILE
        # ----------------------------------------------------
        comp = subprocess.run(
            ["g++", "-std=c++17", "main.cpp", "-o", "prog"],
            cwd=tmp,
            capture_output=True,
            text=True
        )

        if comp.returncode != 0:
            # Try extract line + column
            m = re.search(r'main\\.cpp:(\\d+):(\\d+): (.*)', comp.stderr)
            if m:
                line = int(m.group(1))
                col = int(m.group(2))
                msg = m.group(3)
            else:
                line = None
                col = None
                msg = comp.stderr.strip()

            return {
                "status": "error",
                "diagnostics": {
                    "message": msg,
                    "line": line,
                    "column": col,
                    "severity": "error",
                    "snippet": None
                }
            }

        # ----------------------------------------------------
        # RUN PROGRAM
        # ----------------------------------------------------
        try:
            run = subprocess.run(
                ["./prog"],
                cwd=tmp,
                capture_output=True,
                text=True,
                timeout=3
            )
        except subprocess.TimeoutExpired:
            return {"status": "error", "diagnostics": {"message": "Time Limit Exceeded"}}

        if run.returncode != 0:
            return {
                "status": "error",
                "diagnostics": {"message": run.stderr, "severity": "error"}
            }

        lines = run.stdout.strip().split("\n")
        results = []

        for line in lines:
            parts = list(map(int, line.split()))
            results.append(parts[1:])  # skip vector size

        for inp, out in zip(TESTS, results):
            exp = correct(inp)
            if out != exp:
                return {
                    "status": "wrong",
                    "input": inp,
                    "output": out,
                    "expected": exp
                }

        return {"status": "ok"}


# ============================================================
# ENTRY POINT
# ============================================================
def judge(lang, code):
    if lang == "python":
        return judge_python(code)
    if lang == "cpp":
        return judge_cpp(code)
    return {"status": "error", "message": "Unknown language"}
