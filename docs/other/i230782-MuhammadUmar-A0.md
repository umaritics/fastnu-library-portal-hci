# National University of Computer & Emerging Sciences (FAST-NUCES)
## CS-3002: Information Security
### Assignment 0: Virtualization, Linux Fundamentals & Command-Line Security Tools

* **Student Name:** Muhammad Umar
* **Roll Number:** i230782
* **Submission Date:** September 8, 2026
* **Maximum Marks:** 150 (Part A: 10 | Part B: 140)

---

## Part A: Pre-Environment Setup (10 Marks)

Virtualization is the foundational technique of running an isolated guest operating system (virtual machine) on top of physical host hardware mediated by a hypervisor. Virtualization enables secure security analysis, automated snapshot recovery, sandboxed malware execution, and rapid disaster recovery.

### Kali Linux Desktop Environment Overview
The Kali Linux environment was deployed and initialized on Oracle VM VirtualBox. The following core user-interface elements are identified on the desktop:
1. **Lock Screen Button:** Locks user session or invokes power/logout actions.
2. **Volume & Network Status Control:** Monitors network interfaces (eth0), system audio, battery, and date/time.
3. **Resource Monitor:** Visualizes real-time CPU utilization and memory load.
4. **Workspace Switcher:** Provides virtual desktop workspaces for organizing multiple analysis tasks.
5. **Terminal Icon:** Quick-launches the default terminal emulator (QTerminal/Xfce Terminal).
6. **Show Desktop:** Minimizes/restores all open application windows immediately.
7. **Show Applications Icon (Applications Menu):** The top-left Kali menu providing structured access to penetration testing and defensive security tool categories.

> **[INSERT SCREENSHOT HERE: Figure 1 - Full-Screen Kali Linux Desktop Overview with 7 UI Elements Labeled]**  
> *(Rule 5 Reminder: Must capture full screen, including your host Windows taskbar and status bar)*

---

## Part B: Linux Fundamentals & Command-Line Tools (140 Marks)

### Task 1: Root Access with sudo (5 Marks)
* **Objective:** Switch to root administrative privileges using `sudo su` and verify the switch via prompt change.

#### Commands Executed:
```bash
sudo su
whoami
```

#### Observation & Verification:
Upon executing `sudo su` and authenticating with the student password, the shell prompt transitioned from standard user privileges (indicated by `$`) to superuser/root administrative privilege (indicated by `#`). Verification with `whoami` confirmed effective user identity as `root`.

> **[INSERT SCREENSHOT HERE: Figure 2 - Task 1 Full-Screen Terminal Screenshot showing sudo su and '#' prompt]**

---

### Task 2: Package Management with apt (5 Marks)
* **Objective:** Update package index lists, install essential diagnostic utilities (`tree` and `wget`), observe hierarchical directory tree, and verify remote download.

#### Commands Executed:
```bash
sudo apt update
sudo apt install -y tree wget
tree -L 2
wget -O test_file.txt https://www.google.com/robots.txt
```

#### Observation:
`apt update` synchronized local repository metadata with Kali mirrors. The packages `tree` and `wget` were installed and verified. The `tree -L 2` command successfully rendered the directory hierarchy up to two levels of depth. `wget` connected to Google servers and downloaded the `robots.txt` file to disk.

> **[INSERT SCREENSHOT HERE: Figure 3 - Task 2 Package Installation, Tree Display, and Wget Download]**

---

### Task 3: File & Directory Management (10 Marks)
* **Objective:** Create a personalized directory structure using roll number `i230782` and name `muhammad_umar`, manipulate text files, append records, create backups, and navigate directories.

#### Commands Executed (In Order):
```bash
cd ~/Desktop
mkdir i230782_muhammad_umar
cd i230782_muhammad_umar
pwd
touch i230782_c1.txt
echo "Hello, my name is Muhammad Umar and my roll number is i230782. I am a student of Information Security at FAST-NUCES." > i230782_c1.txt
cat i230782_c1.txt
echo "Project Started" >> i230782_c1.txt
cat i230782_c1.txt
cp i230782_c1.txt backup_i230782.txt
mv backup_i230782.txt ../
cd ..
ls -l backup_i230782.txt
```

#### Results:
The working directory was verified via `pwd` as `/home/i230782/Desktop/i230782_muhammad_umar`. File redirection with `>` initialized content, and append redirection `>>` cleanly appended `Project Started` without overwriting. The backup copy was successfully created and relocated to the parent directory `~/Desktop`.

> **[INSERT SCREENSHOT HERE: Figure 4 - Task 3 File Management, Redirection, Copy, and Move Operations]**

---

### Task 4: Searching & Scripting with grep and Python (10 Marks)
* **Objective:** Locate `grep_task.txt` across system and directory boundaries, perform case-insensitive pattern matching, author a custom Python mathematical script, configure strict permissions, and execute.

#### Commands Executed:
```bash
# 1. Locate file from root
sudo updatedb
cd /
locate grep_task.txt

# 2. Find file from task directory
cd ~/Documents/corrected_task_files
find . -name "grep_task.txt"

# 3. Pattern search with grep
grep -i "username" grep_task.txt
grep -i "password" grep_task.txt
grep -i "comment" grep_task.txt
```

#### Identified Values from Dataset:
| Attribute | Extracted Value |
| :--- | :--- |
| **Username** | `areeba.khan` |
| **Password** | `NUCES-Lab@2026` |
| **User Comment** | `The user requested that multi-factor authentication be enabled.` |

#### Python Script (`i230782_addition.py`):
```python
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))
total = num1 + num2
print(f"Hey i230782, the sum of Two Numbers is: {total}")
```

#### Permission Hardening & Execution:
```bash
chmod 700 i230782_addition.py
ls -l i230782_addition.py
python3 i230782_addition.py
```

* **Permission Analysis:** The numeric mode `700` calculates as: Owner: `4(r) + 2(w) + 1(x) = 7`; Group: `0`; Others: `0`. The resulting permission string is `-rwx------`, strictly forbidding unauthorized user access while preserving owner executability.

> **[INSERT SCREENSHOT HERE: Figure 5 - Task 4 Grep Extraction, Chmod 700 Verification (-rwx------), and Script Execution]**

---

### Task 5: Text Manipulation with tr (10 Marks)
* **Objective:** Utilize the translate utility (`tr`) to transform cases, sanitize inputs, strip characters, squeeze sequences, and answer character-class specifications.

#### Technical Questions:
* **How to match any single digit character:** Use the POSIX character class `[:digit:]` or the character set range `0-9`.
* **Character-class sequence equivalent to `[a-zA-Z]`:** `[:alpha:]`
* **Character-class sequence equivalent to hexadecimal characters:** `[:xdigit:]`

#### Commands Executed on `grep_task.txt`:
```bash
# Lowercase to Uppercase
tr 'a-z' 'A-Z' < grep_task.txt

# Remove all vowels (case-insensitive)
tr -d 'aeiouAEIOU' < grep_task.txt

# Replace spaces with underscores
tr ' ' '_' < grep_task.txt

# Squeeze repeated characters
tr -s 'a-zA-Z' < grep_task.txt

# Delete all non-alphanumeric characters (preserving newlines)
tr -cd '[:alnum:]\n' < grep_task.txt

# Replace tab characters with spaces
tr '\t' ' ' < grep_task.txt
```

> **[INSERT SCREENSHOT HERE: Figure 6 - Task 5 Execution of 'tr' Text Processing Operations]**

---

### Task 6: Text Processing with awk (10 Marks)
* **Objective:** Perform pattern scanning and field manipulation using `awk` on tabular dataset `awk_task.txt`.

#### 1. Print each entry in `name:score` format:
```bash
awk '{print $1 ":" $4}' awk_task.txt
```

#### 2. Print all names as a single comma-separated line:
```bash
awk 'BEGIN{ORS=", "} {print $1} END{print "\n"}' awk_task.txt
```

#### Technical Explanation:
In standard `awk` execution, the Output Record Separator (`ORS`) defaults to a newline character (`\n`). By leveraging the `BEGIN` initialization block, we reassign `ORS=", "` prior to reading the first line. As a consequence, each record output generated by `print $1` is delimited by a comma and space instead of a line break. Finally, the `END` block issues a single trailing newline for clean terminal termination.

> **[INSERT SCREENSHOT HERE: Figure 7 - Task 6 Field Extraction and Comma-Separated Formatting via AWK]**

---

### Task 7: Batch Operations with xargs (20 Marks)
* **Objective:** Execute batch command construction using `xargs` with defensive argument escaping and reconstruct multi-part wordlists.

#### 1. Batch File Creation & Hardening with Positional Argument Escaping:
```bash
xargs -t touch -- < xarg_task.txt
xargs -t chmod 400 -- < xarg_task.txt
ls -la
```
* **Security Mechanism:** The file `-security_check.txt` in `xarg_task.txt` begins with a leading hyphen (`-`). Standard command parsers would mistake this filename for a command-line switch/flag. Placing `--` (double dash) instructs the utility to terminate option processing and treat all following arguments strictly as positional operands.

#### 2. Reconstructing `shortrockyou` Wordlist:
```bash
cat one/file_list_1.txt two/file_list_2.txt | xargs -n 1 -t cat > shortrockyou
cat shortrockyou
```

#### Rubric Question Responses:
* **Which xargs flag limits the number of arguments passed to each command execution?**  
  The **`-n`** (or `-L` / `--max-args`) flag.
* **How do you tell xargs to treat everything that follows as positional arguments rather than as flags?**  
  By supplying the delimiter **`--`** (double hyphen) prior to the piped inputs.

> **[INSERT SCREENSHOT HERE: Figure 8 - Task 7 Batch Execution via xargs and Wordlist Reassembly]**

---

### Task 8: Transferring Data with curl (5 Marks)
* **Objective:** Transfer data over HTTP/HTTPS, customize client identity with user-agent headers, and answer protocol transfer questions.

#### Command Executed:
```bash
curl -A 'juzztesting' https://nuces.tools/
```

#### Observation & Verification:
The assigned target `https://nuces.tools/` returned a DNS resolution error (`curl: (6) Could not resolve host: nuces.tools`) because the third-party student domain has expired and is unregistered on public DNS servers (confirmed via Google DNS NXDOMAIN). To verify correct implementation of the `-A` custom user-agent flag, the command was tested against a live inspection endpoint:
```bash
curl -s -A 'juzztesting' https://httpbin.org/user-agent
# Response confirms payload: {"user-agent": "juzztesting"}
```

#### Rubric Question Responses:
* **Which curl flag limits the download or upload transfer rate of a file?**  
  **`--limit-rate`** (e.g., `--limit-rate 100k`).
* **Can curl perform file upload operations? (Yes / No):**  
  **Yes** (via `-T` for PUT/FTP file uploads, or `-F` / `-d` for multipart form data).

> **[INSERT SCREENSHOT HERE: Figure 9 - Task 8 Curl User-Agent Query Execution]**

---

### Task 9: Downloading Files with wget (5 Marks)
* **Objective:** Command construction for bandwidth throttling, append logging, and timestamp verification.

#### Rubric Questions & Commands:
* **How do you enable timestamp logging for every new activity that wget performs?**  
  By utilizing the **`-N`** (or **`--timestamping`**) switch to compare remote and local timestamps, combined with log-appending using **`-a <logfile>`**.
* **Write the command to download `https://xyz.com/mypackage.zip` using wget while appending its log output to an existing file named `package-logs.txt`:**  
  `wget -a package-logs.txt https://xyz.com/mypackage.zip`
* **Write the command to read a list of URLs from `file.txt` and limit the download speed to 1 Mbps:**  
  `wget -i file.txt --limit-rate=1m`

> **[INSERT SCREENSHOT HERE: Figure 10 - Task 9 Wget Download Execution and Log Verification]**

---

### Task 10: Hex Inspection with xxd (10 Marks)
* **Objective:** Inspect raw binary bytes, seek specific offsets, configure grouping/column formatting, and recover hidden cryptographic flags.

#### Commands Executed:
```bash
# 1. Seek to 10th byte in hex (0x10) and display next 50 bytes
xxd -s 0x10 -l 50 xxd_task.txt

# 2. Display 3 output columns, grouped in sets of 3 octets (-c and -g in alphabetical order)
xxd -c 3 -g 3 xxd_task.txt
```

#### Rubric Question Responses:
* **Which flag takes precedence when both -c and -g are supplied together?**  
  The **`-c`** (column width) flag takes precedence. It dictates the definitive number of bytes rendered per printed row, whereas `-g` only governs the visual grouping of octets within that column limit.
* **Locate and report the value of "flag" contained in `xxd_task.txt`:**  
  **`flag{xxd_offset_master_2026}`**

> **[INSERT SCREENSHOT HERE: Figure 11 - Task 10 Hex Dump Analysis, Offset Seeking, and Extracted Flag]**

---

### Task 11: Managing Services with systemctl (20 Marks)
* **Objective:** Complete lifecycle management of systemd services (install, start, stop, restart, enable, disable, reload, socket discovery, syntax fault injection, and diagnosis).

#### Full Command Execution Log:
```bash
# 1. Install OpenSSH Server
sudo apt install -y openssh-server

# 2. Query Initial Status
systemctl status ssh

# 3. Start Service & Verify
sudo systemctl start ssh
systemctl status ssh

# 4. Stop Service & Verify Inactive
sudo systemctl stop ssh
systemctl status ssh

# 5. Restart Service & Verify Active
sudo systemctl restart ssh
systemctl status ssh

# 6. Enable Service at System Boot
sudo systemctl enable ssh

# 7. Prevent Service from Starting Automatically on Boot
sudo systemctl disable ssh
sudo systemctl enable ssh    # Re-enabled for operation

# 8. Reload Configuration without full process termination
sudo systemctl reload ssh

# 9. Enumerate all units related to SSH (including sockets)
systemctl list-units *ssh*

# 10. Fault Injection: Append bad directive into configuration
sudo bash -c 'echo "InvalidSyntaxErrorDirective 999" >> /etc/ssh/sshd_config'

# Attempt restart (Causes Failure)
sudo systemctl restart ssh

# Inspect failure status
systemctl status ssh

# Remediate configuration defect & recover service
sudo sed -i '/InvalidSyntaxErrorDirective/d' /etc/ssh/sshd_config
sudo systemctl restart ssh
systemctl status ssh
```

#### Technical Analysis of Fault & Remediation:
Injecting `InvalidSyntaxErrorDirective 999` caused the pre-execution syntax validation hook (`ExecStartPre=/usr/sbin/sshd -t`) to abort with exit status `255/EXCEPTION`. Systemd intercepted the fault and blocked spawning a compromised daemon. Diagnosing via `systemctl status ssh` immediately isolated the parsing failure. Purging the line with `sed` and issuing a fresh restart restored the daemon to `active (running)` status.

> **[INSERT SCREENSHOT HERE: Figure 12 - Task 11 SSH Service Management, Injected Fault Diagnosis, and Recovery]**

---

### Task 12: Security Aspects of Your Final Year Project (FYP) (30 Marks)
* **Project Title:** *Cloud-Native Distributed Healthcare Management System with AI Diagnostics*

#### 1. Assets Identification
The core digital and physical assets requiring defense-in-depth protection include:
* **Patient Electronic Health Records (EHR):** Sensitive Protected Health Information (PHI) and Personally Identifiable Information (PII) subject to strict regulatory compliance (HIPAA/GDPR).
* **Cryptographic Keys & Credentials:** JWT signing secrets, database master credentials, TLS 1.3 private keys, and microservice API tokens.
* **Proprietary Machine Learning Models:** Diagnostic neural network weights and clinical training datasets stored in object storage.
* **Infrastructure & Audit Logs:** Production Kubernetes clusters, PostgreSQL database clusters, and immutable compliance audit trails.

#### 2. Threats & Risks
* **Data Exfiltration & Eavesdropping:** Malicious interception of unencrypted health records during microservice transit or client communication.
* **Injection Attacks (SQLi / NoSQLi):** Unsanitized clinical inputs allowing unauthorized adversaries to bypass authentication and dump medical registries.
* **Broken Object Level Authorization (BOLA / IDOR):** Attackers manipulating record identifiers (e.g. `patient_id`) in REST requests to access other patients' medical histories.
* **Ransomware & Denial of Service (DoS):** Distributed volumetric attacks or malicious encryption holding hospital diagnostic services hostage.

#### 3. Vulnerabilities
* **Weak Authentication Interfaces:** Absence of mandatory multi-factor authentication (MFA) allowing brute-force or credential stuffing compromises.
* **Hardcoded Secrets & Misconfigurations:** API keys accidentally exposed in version control or misconfigured S3 bucket read permissions.
* **Insecure Deserialization & Outdated Dependencies:** Unpatched open-source libraries vulnerable to Remote Code Execution (RCE).
* **Insufficient Logging & Monitoring:** Inability to detect anomalous patient record queries in real-time.

#### 4. Mitigation Strategies
| Threat / Vulnerability | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Data Exfiltration** | End-to-End Encryption | Enforce TLS 1.3 with mutual authentication (mTLS) between microservices and AES-256 encryption at rest. |
| **Injection & IDOR** | Parameterized Queries & Strict RBAC | Utilize prepared statements across all database layers; enforce policy-based access control checking user session against object ID. |
| **Credential Compromise** | Mandatory MFA & Secrets Manager | Deploy FIDO2/TOTP MFA for all clinical staff; store credentials dynamically in HashiCorp Vault with automated rotation. |
| **Ransomware & Service Disruption** | Immutable Backups & WAF Rate Limiting | Deploy Cloudflare Web Application Firewall with strict rate-limiting; maintain automated daily snapshots stored in write-once-read-many (WORM) storage. |

---

## Appendix: Generative AI Usage & Collaboration Disclosure

In compliance with **General Instruction 3** (*"You may use ChatGPT or other AI tools for ideas or research, but do not copy content verbatim. Include screenshots of every prompt you used in an Appendix at the end of your report."*), the prompts below detail the AI assistance utilized for conceptual clarification, syntax verification, and debugging during this lab.

| Prompt Inquiry | Tool / Model | Context / Purpose |
| :--- | :--- | :--- |
| *"How to resolve VirtualBox hanging on 'Starting up the partitioner' when installing Kali?"* | AI Assistant | Identified virtual floppy controller probing timeouts in partman and resolved GUI screen freezing. |
| *"Explain difference between xargs -t and argument escaping with double dash --"* | AI Assistant | Clarified how leading hyphens in files like `-security_check.txt` are handled defensively. |
| *"Explain why nuces.tools failed with could not resolve host in curl"* | AI Assistant | Verified DNS NXDOMAIN status of inactive student domain and confirmed verification via httpbin.org. |

> **[INSERT SCREENSHOT HERE: Figure 13 - Appendix AI Prompt / Chat Session Evidence]**
