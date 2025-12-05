import subprocess
import tempfile
import json
from pathlib import Path
import re

# ----------------------------------------------------
# TEST CASES
# ----------------------------------------------------
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
# PYTHON JUDGE (with VS Code-style error reporting)
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
        out = my_sort(list(t))  # call student code
        results.append(out)

    print(json.dumps({{"results": results}}))

except Exception:
    tb = traceback.format_exc()

    # Try to extract line number from student.py
    # Example: File "student.py", line 7
    import re
    match = re.search(r'student\\.py", line (\\d+)', tb)
    line = int(match.group(1)) if match else None

    # Extract last line of traceback (the error message)
    error_msg = tb.strip().split("\\n")[-1]

    print(json.dumps({{
        "error": error_msg,
        "line": line,
        "traceback": tb
    }}))
"""

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)

        # Write files
        (tmp / "student.py").write_text(code)
        (tmp / "run.py").write_text(harness)

        # Run the harness
        try:
            proc = subprocess.run(
                ["python", "run.py"],
                cwd=tmp,
                capture_output=True,
                text=True,
                timeout=3
            )
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Time Limit Exceeded"}

        # If Python crashed
        if proc.returncode != 0:
            return {"status": "error", "message": proc.stderr}

        # Parse JSON
        try:
            data = json.loads(proc.stdout)
        except Exception:
            return {"status": "error", "message": "Invalid output"}

        # VS Code-style error output
        if "error" in data:
            return {
                "status": "error",
                "error": data["error"],
                "line": data["line"],
                "traceback": data["traceback"]
            }

        # Compare sorting result
        for inp, out in zip(TESTS, data["results"]):
            expected = correct(inp)
            if out != expected:
                return {
                    "status": "wrong",
                    "input": inp,
                    "output": out,
                    "expected": expected
                }

        return {"status": "ok"}


# ============================================================
# C++ JUDGE (unchanged)
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

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)

        full_code = CPP_TEMPLATE.format(
            user_code=code,
            tests=TESTS
        )

        (tmp / "main.cpp").write_text(full_code)

        # Compile
        comp = subprocess.run(
            ["g++", "-std=c++17", "main.cpp", "-o", "a.out"],
            cwd=tmp,
            capture_output=True,
            text=True
        )
        if comp.returncode != 0:
            return {
                "status": "error",
                "message": comp.stderr
            }

        # Run
        try:
            run = subprocess.run(
                ["./a.out"],
                cwd=tmp,
                capture_output=True,
                text=True,
                timeout=3
            )
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Time Limit Exceeded"}

        if run.returncode != 0:
            return {"status": "error", "message": run.stderr}

        # Parse output
        lines = run.stdout.strip().split("\n")
        results = []

        for line in lines:
            parts = list(map(int, line.split()))
            results.append(parts[1:])  # skip size number

        # Compare results
        for inp, out in zip(TESTS, results):
            expected = correct(inp)
            if out != expected:
                return {
                    "status": "wrong",
                    "input": inp,
                    "output": out,
                    "expected": expected
                }

        return {"status": "ok"}


# ============================================================
# MAIN ENTRY POINT FOR FASTAPI
# ============================================================
def judge(lang, code):
    if lang == "python":
        return judge_python(code)
    elif lang == "cpp":
        return judge_cpp(code)
    else:
        return {"status": "error", "message": "Unknown language"}
