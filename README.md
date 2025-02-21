# CLSS PWPush Extension

## Overview
The **CLSS PWPush Extension** allows you to quickly send selected text or a custom message to PWPush and generate a secure, self-destructing link. The extension also copies the generated link directly to your clipboard.

## Features
✔️ Send text or selected content to PWPush  
✔️ Generate an encrypted, self-destructing link  
✔️ Copy generated links automatically to clipboard  
✔️ Customize expiration time, max views, and security settings  
✔️ Integrated with the browser's right-click context menu  
✔️ Simple UI with an optional settings panel  

## Installation

👉 [**Chrome Web Store**](https://chrome.google.com/webstore/detail/your-extension-id)

Or manually:

1. Download and extract the extension files.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (top right corner).
4. Click **"Load unpacked"** and select the extracted folder.

## ⚙️ Settings & Configuration
The extension allows customization via the **Settings Page**:

- **Server URL & API Token** – Set a custom PWPush server and authentication token.
- **Expiration Time (Days)** – Define how long the generated link remains active.
- **Max Views** – Limit the number of times the link can be accessed.
- **One-step Link** – Enable or disable one-step retrieval for passwords.
- **Deletable by Viewer** – Allow or prevent users from deleting the link.

### **How to Access Settings**
1. Click the **extension icon** in Chrome.
2. Open **"Settings"** from the popup.
3. Adjust preferences and **Save** your settings.

Alternatively, you can go to:  
📌 `chrome://extensions/` → Click **"Details"** → **"Extension Options"**

## 🛠️ Permissions
The extension requires the following permissions:

- **storage** – To save user settings.  
- **contextMenus** – To add the "Send to PWPush" right-click option.  
- **activeTab** – To execute scripts on the current tab.  
- **scripting** – To interact with the clipboard.  
- **notifications** – To display notifications after generating links.  
- **clipboardWrite** – To copy generated links directly to the clipboard.  

## 🖥️ How to Use
### **Option 1: Using the Extension Popup**
1. Click on the **extension icon** in Chrome.  
2. Enter text or a URL into the input box.  
3. (Optional) Adjust security settings via "Show Optional Settings."  
4. Click **"Generate PWPush Link"** – the link will be copied automatically.  

### **Option 2: Using the Right-Click Context Menu**
1. Select any text on a webpage.  
2. Right-click and choose **"Send to PWPush."**  
3. The generated link is copied to your clipboard.  

## 📂 Project Files & Structure

│── manifest.json # Chrome extension manifest 
│── popup.html # Popup interface 
│── popup.js # Popup logic and interactions 
│── options.html # Extension settings page 
│── options.js # Handles settings storage and retrieval 
│── background.js # Background script for context menu and API communication 
│── icons/ # Extension icons 

## 📂 GitHub Repository
The source code for this extension is available on GitHub.

👉 [View on GitHub](https://github.com/your-username/your-repository)

## 📜 License
This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute the code under the terms of this license.  

## 👨‍💻 **Extension Developer**  
Created by **//coding.lifestyle Studio**  
🌐 [Website](https://www.clss.pl/)
