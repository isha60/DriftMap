# DriftMap EC2 Deployment Guide

Here is the complete, step-by-step process for deploying DriftMap directly to your AWS EC2 instance without using Nginx.

Since we are not using Nginx to reverse-proxy port 80, your application will be served directly from Node.js on port **3000**. Users will need to append `:3000` to your IP address to visit the site (e.g., `http://your-ec2-ip:3000`).

---

## Step 1: Prepare the EC2 Instance (Security Groups)

Before touching the terminal, ensure your EC2 instance is configured to accept web traffic on your application's port.
1. Go to your AWS EC2 Dashboard.
2. Select your instance and click the **Security** tab, then click the **Security Group**.
3. Click **Edit inbound rules** and add the following:
   - **Type:** SSH | **Port Range:** 22 | **Source:** Anywhere (Or your specific IP)
   - **Type:** Custom TCP | **Port Range:** 3000 | **Source:** Anywhere (0.0.0.0/0)
4. Save the rules.

---

## Step 2: Connect and Install Dependencies

Connect to your EC2 instance using SSH (`ssh -i your-key.pem ubuntu@your-ec2-ip`). Once logged in, run these commands to install the required software:

### 1. Update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (v20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install Git:
```bash
sudo apt-get install -y git
```

### 4. Install PM2 (Process Manager for Node.js):
PM2 will keep your app running online 24/7 even if it crashes or the server restarts.
```bash
sudo npm install -g pm2
```

---

## Step 3: Clone & Setup Your Application

### 1. Clone the repository:
```bash
# Replace this with your actual Git repository URL
git clone <YOUR_GITHUB_REPO_URL> driftmap
cd driftmap
```

### 2. Install Packages:
```bash
npm install
```

### 3. Set Up the Environment Variables:
Create your `.env.local` file to hold your database secret and JWT token securely:
```bash
nano .env.local
```
Paste your precise credentials inside:
```env
MONGODB_URI=mongodb+srv://isha37623_db_user:Esmyp9mU4Y6zT4cc@driftmap.ceb83gv.mongodb.net/?appName=driftmap
JWT_SECRET=4bd50882e3c089f2a6774619d85459313db0f882c49d85459313db0f882c49d8
```
*(Press `Ctrl+O` -> `Enter` to save, then `Ctrl+X` to exit).*

---

## Step 4: Build and Start the App (Production Mode)

Never use `npm run dev` in production, as development mode causes extreme memory usage, WebSocket blocking conflicts, and 500 errors. We will do a full production build instead.

### 1. Clean cache & build the app:
```bash
# This cleans out any residual dev-server files before making the pure prod build
rm -rf .next
npm run build
```

### 2. Start the app dynamically with PM2:
Because we removed Nginx, Next.js must handle all direct web requests. We will tell PM2 to start Next.js dynamically bound to `0.0.0.0` (all interfaces) on Port `3000`.

```bash
pm2 start npm --name "driftmap" -- run start -- -H 0.0.0.0 -p 3000
```

### 3. Ensure PM2 restarts the app automatically if the server reboots:
```bash
pm2 save
pm2 startup
```

---

## Step 5: Verify and Troubleshoot!

You are now fully deployed! You can visit your site by taking your **EC2 Public IP address** and adding `:3000` to the end in your browser. 

Example: `http://54.123.45.67:3000`

If something isn't working:
- **View app crashing errors:** `pm2 logs driftmap`
- **Is the site taking forever to load?** Double-check your AWS Security Group. If "Custom TCP 3000" isn't explicitly open to `0.0.0.0/0`, the browser will just spin and time out.
- **Did you pull new code from Github?** Run this to refresh it:
  ```bash
  git pull
  npm install
  npm run build
  pm2 restart driftmap
  ```
