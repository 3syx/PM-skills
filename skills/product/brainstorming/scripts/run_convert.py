# -*- coding: utf-8 -*-
"""Wrapper: copy files to temp dir, convert, copy back."""
import shutil
import subprocess
import sys
import os
import tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.join(SCRIPT_DIR, "..")
INPUT_MD = os.path.join(BASE_DIR, "brainstorming-mmba-plan.md")
OUTPUT_DOCX_NAME = "电销系统对接MMBA工作手机方案.docx"
OUTPUT_DOCX = os.path.join(BASE_DIR, OUTPUT_DOCX_NAME)

tmpdir = tempfile.mkdtemp(prefix="mmba_")
tmp_md = os.path.join(tmpdir, "input.md")
tmp_py = os.path.join(tmpdir, "md2docx.py")
tmp_docx = os.path.join(tmpdir, "output.docx")

# read converter script and patch paths
with open(os.path.join(SCRIPT_DIR, "md2docx.py"), "r", encoding="utf-8") as f:
    converter_code = f.read()

# replace INPUT/OUTPUT with temp paths
patched = converter_code.replace(
    'INPUT = os.path.join(SCRIPT_DIR, "..", "brainstorming-mmba-plan.md")',
    f'INPUT = r"{tmp_md}"',
)
patched = patched.replace(
    'OUTPUT = os.path.join(SCRIPT_DIR, "..", "电销系统对接MMBA工作手机方案.docx")',
    f'OUTPUT = r"{tmp_docx}"',
)

# copy md, write patched script
shutil.copy2(INPUT_MD, tmp_md)
with open(tmp_py, "w", encoding="utf-8") as f:
    f.write(patched)

print(f"Temp dir: {tmpdir}")
print(f"Running converter...")

result = subprocess.run(
    [sys.executable, tmp_py],
    capture_output=True,
    text=True,
    encoding="utf-8",
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

if result.returncode != 0:
    print(f"FAILED with code {result.returncode}")
    sys.exit(1)

if os.path.exists(tmp_docx):
    shutil.copy2(tmp_docx, OUTPUT_DOCX)
    size = os.path.getsize(OUTPUT_DOCX)
    print(f"SUCCESS! File saved to: {OUTPUT_DOCX} ({size} bytes)")
else:
    print("ERROR: output docx not found")
    sys.exit(1)

# cleanup
shutil.rmtree(tmpdir, ignore_errors=True)
