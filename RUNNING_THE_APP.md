# How to Run the Deployed App (Every Time You Start EC2)

Because you are using AWS EC2, every time you **Stop** and **Start** your instance, AWS gives you a **brand new Public IP address**. 

If you just started your EC2 server for the day, follow these exact steps to get your app running and accessible.

---

## Step 1: Find Your New IP Address
1. Go to the [AWS EC2 Console](https://console.aws.amazon.com/ec2/).
2. Click on **Instances** and select `Driftmap2`.
3. Wait until the **Instance state** says `Running` and the **Status check** says `2/2 checks passed` (this takes about 2 minutes).
4. Look at the bottom details panel and copy the **Public IPv4 address**.
   *(Example: `43.204.130.121`)*

---

## Step 2: Connect to the Server
1. Click the **Connect** button at the top of the EC2 page.
2. Go to the **EC2 Instance Connect** tab.
3. Click **Connect**. A black terminal window will open in your browser.

---

## Step 3: Start the App
Run these commands one by one to ensure the app is running:

### 1. Go to the app folder:
```bash
cd ~/driftmap
```

### 2. Start the app using PM2:
```bash
pm2 start npm --name "driftmap" -- run start -- -H 0.0.0.0 -p 3000
```
*(If it says the process already exists, that's fine, it means it auto-started!)*

### 3. Save it so it remembers to run:
```bash
pm2 save
```

---

## Step 4: What to Check (Verification)

Before you close the terminal, check these two things to make sure the app didn't crash:

### Check 1: Is it online?
```bash
pm2 status
```
- **You should see:** `driftmap` with a green `online` status.
- **If it says `errored`:** The app crashed. Proceed to Check 2.

### Check 2: Are there any errors?
```bash
pm2 logs driftmap --lines 20
```
- **You should see:** `Ready in xxx ms` and `Local: http://localhost:3000`.
- **If you see red text or MONGODB_URI errors:** Your `.env.local` file might be missing or corrupted.
- *(Press `Ctrl+C` to exit the log view)*

---

## Step 5: Open the App in Your Browser
Once `pm2 status` shows `online`, open a new browser tab and type:
```
http://YOUR_NEW_PUBLIC_IP:3000
```
*(Make sure to use `http://` and NOT `https://`, and don't forget the `:3000` at the end!)*

---

## 💡 Pro Tip: Stop Your IP From Changing
Tired of your IP changing every time you start the server? 
1. In the AWS Console left menu, go to **Network & Security > Elastic IPs**.
2. Click **Allocate Elastic IP address** > Allocate.
3. Select the new IP, click **Actions > Associate Elastic IP address**.
4. Choose `Driftmap2` and click **Associate**.
Now your IP will *never* change!
