import subprocess
import tempfile
import json
from pathlib import Path
import re
import inspect

TESTS = [
    [5, 3, 8, 1, 2],
    [10, 9, 8, 7],
    [2, 5, 1, 4, 3],
    [],
    [100, -1, 50, 0],

    # more coverage
    [1],
    [0],
    [0, 0, 0, 0],
    [3, 3, 3, 2, 2, 1, 1],
    [-5, -10, -3, -1, -7],
    [1, 2, 3, 4, 5],             # already sorted
    [5, 4, 3, 2, 1],             # reverse sorted
    [9, 9, 9, 9, 9],             # all duplicates
    [1000, 999, -1000, 0, 1],
    [-1, 0, 1, -1, 0, 1],

    # floats
    [1.5, 3.2, 0.1, 2.8],
    [0.0001, -0.0002, 0.0, 5.5],

    # mix large/small
    [9999999, -9999999, 5000, 0, 42],

    # repeating patterns
    [2, 1, 2, 1, 2, 1],
    [7, 8, 7, 8, 7, 8],

    # random-like
    [34, 1, 67, 23, 89, 2, 90, 5],
]



def correct(x):
    return sorted(x)


# ============================================================
# PYTHON JUDGE
# ============================================================
def judge_python(code: str):

    harness = f"""
import json
import traceback
import student
import inspect

TESTS = {TESTS}

# Collect user functions
candidates = {{}}
for name, obj in student.__dict__.items():
    if inspect.isfunction(obj) and not name.startswith("__"):
        candidates[name] = obj

if not candidates:
    print(json.dumps({{
        "status": "error",
        "diagnostics": {{
            "message": "No callable user functions found.",
            "line": None,
            "column": None,
            "severity": "error",
            "snippet": None
        }}
    }}))
    raise SystemExit

def run_func(fn):
    local_results = []
    for t in TESTS:
        out = fn(list(t))
        local_results.append(out)
    return local_results

chosen = None
results = None

try:
    for name, fn in candidates.items():
        try:
            trial = run_func(fn)
        except Exception:
            continue
        results = trial
        chosen = name
        break

    if results is None:
        print(json.dumps({{
            "status": "error",
            "diagnostics": {{
                "message": "All user functions failed to execute successfully.",
                "line": None,
                "column": None,
                "severity": "error",
                "snippet": None
            }}
        }}))
        raise SystemExit

    print(json.dumps({{"results": results, "chosen_function": chosen}}))

except Exception:
    tb = traceback.format_exc()
    message = tb.strip().split("\\n")[-1]

    if "IndexError" in message:
        message = "Index out of range"

    m = re.search(r'student\\.py", line (\\d+)', tb)
    line = int(m.group(1)) if m else None

    m2 = re.search(r'File ".*student\\.py", line \\d+\\n\\s*(.*)', tb)
    snippet = m2.group(1).strip() if m2 else None

    print(json.dumps({{
        "status": "error",
        "diagnostics": {{
            "message": message,
            "line": line,
            "column": None,
            "severity": "error",
            "snippet": snippet
        }},
        "traceback": tb
    }}))
"""

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
            return {"status": "error", "diagnostics": {"message": "Invalid JSON output"}}

        if data.get("status") == "error":
            return data

        for inp, out in zip(TESTS, data["results"]):
            exp = correct(inp)
            if out != exp:
                return {
                    "status": "wrong",
                    "input": inp,
                    "output": out,
                    "expected": exp,
                    "chosen_function": data.get("chosen_function")
                }

        return {"status": "ok", "chosen_function": data.get("chosen_function")}


# ============================================================
# C++ JUDGE
# ============================================================
CPP_TEMPLATE = """
#include <bits/stdc++.h>
using namespace std;

{user_code}

// must return vector<int>
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
        (tmp / "main.cpp").write_text(CPP_TEMPLATE.format(user_code=code, tests=TESTS))

        comp = subprocess.run(
            ["g++", "-std=c++17", "main.cpp", "-o", "prog"],
            cwd=tmp,
            capture_output=True,
            text=True
        )

        if comp.returncode != 0:
            m = re.search(r'main\\.cpp:(\\d+):(\\d+): (.*)', comp.stderr)
            if m:
                line = int(m.group(1))
                col = int(m.group(2))
                msg = m.group(3)
            else:
                line = col = None
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
            return {"status": "error", "diagnostics": {"message": run.stderr}}

        lines = run.stdout.strip().split("\\n")
        results = [list(map(int, line.split()))[1:] for line in lines]

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
