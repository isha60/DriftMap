# DriftMap — AWS EC2 Deployment Guide (Amazon Linux, No Nginx)

A complete, step-by-step guide to deploying the DriftMap Next.js application on an AWS EC2 instance running **Amazon Linux 2023**, using Node.js and PM2. No Nginx needed — the app is served directly on port **3000**.

---

## Prerequisites

Before you begin, make sure you have:
- An **AWS account** with EC2 access.
- Your **DriftMap repository** pushed to GitHub.
- A **MongoDB Atlas** cluster already created and running.
- Your **GitHub Personal Access Token (PAT)** if your repo is private.

---

## Step 1: Launch an EC2 Instance

1. Go to the [AWS EC2 Console](https://console.aws.amazon.com/ec2/).
2. Click **Launch Instance**.
3. Configure the instance:
   - **Name:** `driftmap-server`
   - **AMI (OS):** `Amazon Linux 2023 AMI` — Free tier eligible ✅
   - **Instance Type:** `t2.micro` (Free Tier) or `t3.small` for better performance.
   - **Key Pair:**
     - Click **Create new key pair**.
     - Name it `driftmap-key`, select **RSA**, format `.pem`, and click **Create**.
     - ⚠️ **The `.pem` file downloads automatically. Keep it safe — you cannot re-download it.**
4. Under **Network Settings**, click **Edit** and configure:
   - **Allow SSH traffic from:** `My IP` (recommended) or `Anywhere`.
5. Under **Configure Storage**, set **8 GiB** (minimum) or **20 GiB** (recommended for builds).
6. Click **Launch Instance** and wait ~1 minute for it to start.

---

## Step 2: Configure Security Group Rules

Since we are not using Nginx, we only need **SSH** and **port 3000** open.

1. In the EC2 Dashboard, select your instance.
2. Click the **Security** tab → click the **Security Group** link.
3. Click **Edit Inbound Rules** and ensure these rules exist:

| Type        | Protocol | Port  | Source               | Purpose                  |
|-------------|----------|-------|----------------------|--------------------------|
| SSH         | TCP      | 22    | My IP (or 0.0.0.0/0) | Remote terminal access   |
| Custom TCP  | TCP      | 3000  | 0.0.0.0/0            | Direct Node.js web access |

4. Click **Save Rules**.

---

## Step 3: Connect via EC2 Instance Connect (Browser Terminal)

No SSH client or `.pem` file needed — connect directly from your browser.

1. Go to **EC2 → Instances** in the AWS Console.
2. Select your instance (`Driftmap2`).
3. Click the **Connect** button at the top of the page.
4. Choose the **"EC2 Instance Connect"** tab.
5. Confirm the username is `ec2-user`.
6. Click **Connect**.

A browser terminal will open showing the Amazon Linux 2023 welcome banner:
```
      ####_
     _\####\      Amazon Linux 2023
    ##\#####\
    ##  \####\    https://aws.amazon.com/linux/amazon-linux-2023
    ##  /####/
     ##/###/
      \###/
[ec2-user@ip-xxx-xx-x-xx ~]$
```

You are now connected! ✅ All commands below are run inside this browser terminal.

---

## Step 4: Update the System & Install Core Dependencies

> ℹ️ Amazon Linux 2023 uses **`dnf`** as its package manager instead of `apt`.

### 1. Update all system packages:
```bash
sudo dnf update -y
```

### 2. Install Node.js v20 (LTS):
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

Verify installation:
```bash
node -v   # Should output v20.x.x
npm -v    # Should output 10.x.x
```

### 3. Install Git:
```bash
sudo dnf install -y git
```

### 4. Install PM2 (keeps the app alive 24/7):
```bash
sudo npm install -g pm2
```

---

## Step 5: Clone & Set Up the DriftMap Repository

### 1. Clone the repository:

**If your repo is PUBLIC:**
```bash
git clone https://github.com/isha60/DriftMap.git driftmap
cd driftmap
```

**If your repo is PRIVATE (use your Personal Access Token):**
```bash
git clone https://YOUR_GITHUB_PAT@github.com/isha60/DriftMap.git driftmap
cd driftmap
```

### 2. Install all npm packages:
```bash
npm install
```

### 3. Create the environment variables file:

Your app needs a `.env.local` file with your secrets. **Never commit this file to GitHub.**

```bash
nano .env.local
```

Paste the following:
```env
MONGODB_URI=mongodb+srv://isha37623_db_user:C1xJlFtaq3ZrqgYi@driftmap.ceb83gv.mongodb.net/?appName=driftmap
JWT_SECRET=4bd50882e3c089f2a6774619d85459313db0f882c49d85459313db0f882c49d8
NODE_ENV=production
```

Save and exit: Press `Ctrl+O` → `Enter` → `Ctrl+X`.

### 4. Verify the file was saved:
```bash
cat .env.local
```

---

## Step 6: Build the Application for Production

> ⚠️ **Never use `npm run dev` in production.** Dev mode is memory-intensive and will crash low-tier instances.

### 1. Clean any old build files:
```bash
rm -rf .next
```

### 2. Run the production build:
```bash
npm run build
```

This takes 1–3 minutes. A successful build ends with:
```
✓ Compiled successfully
Route (app)   Size   First Load JS
...
```

> 💡 **If the build crashes with an out-of-memory error** (common on `t2.micro`), add swap memory first:
> ```bash
> sudo dd if=/dev/zero of=/swapfile bs=128M count=8
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
> ```
> Then re-run `npm run build`.

---

## Step 7: Start the App with PM2

### 1. Start DriftMap on port 3000:
```bash
pm2 start npm --name "driftmap" -- run start -- -H 0.0.0.0 -p 3000
```

### 2. Check that the app is running:
```bash
pm2 status
```
You should see `driftmap` with status **`online`**.

### 3. View live logs to confirm no errors:
```bash
pm2 logs driftmap --lines 50
```

Press `Ctrl+C` to exit the log view.

### 4. Save PM2 state and enable auto-start on server reboot:
```bash
pm2 save
pm2 startup
```

> ⚠️ **Important:** `pm2 startup` will output a `sudo env PATH=...` command. **Copy and run that exact command** in your terminal to complete auto-start setup.

---

## Step 8: Verify the Deployment

Open your browser and visit:

```
http://YOUR_EC2_PUBLIC_IP:3000
```

> 💡 Find your **Public IPv4 address** in the EC2 Dashboard under your instance details.

Example: `http://43.204.112.68:3000`

You should see the DriftMap landing page. ✅

---

## Step 9: Redeploy After New Code Changes

Whenever you push new code to GitHub and want to update the server:

```bash
# Navigate to your app directory
cd ~/driftmap

# Pull the latest changes
git pull origin dev   # or main — use whichever branch you pushed to

# Install any new packages
npm install

# Rebuild for production
npm run build

# Restart the app
pm2 restart driftmap
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **EC2 Instance Connect fails** | Instance is still booting. Wait 2 minutes, then retry. |
| **Site won't load in browser** | Verify port **3000** is open in your Security Group Inbound Rules. |
| **App crashes immediately** | Run `pm2 logs driftmap` to see the error message. |
| **Build fails with memory error** | Add swap memory (see Step 6 note above). |
| **MongoDB connection error** | Check `.env.local` values. Whitelist your EC2 public IP in **MongoDB Atlas → Network Access**. |
| **App not restarting after reboot** | Re-run `pm2 startup`, copy-paste the generated command, then run `pm2 save`. |
| **`Cannot find module` error** | Run `npm install` again inside the `driftmap` directory. |

---

## Quick Reference Commands

```bash
# Check app status
pm2 status

# View live logs
pm2 logs driftmap

# Restart the app
pm2 restart driftmap

# Stop the app
pm2 stop driftmap

# Delete the app from PM2
pm2 delete driftmap
```

---

*Deployment guide for DriftMap — Next.js + MongoDB Atlas + AWS EC2 (Amazon Linux 2023) + PM2 (No Nginx)*
