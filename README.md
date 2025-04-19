
# 📡 Comprehensive WiFi Communication System with RAG Integration

## 📘 Overview

This project presents an integrated **Wi-Fi-based communication system** tailored for educational institutions, combined with a **Retrieval-Augmented Generation (RAG)** based campus information retrieval chatbot. The goal is to provide **seamless connectivity and intelligent information access** using a web-based platform, enhancing internal communications and resource accessibility across a college campus.

---

## 🎯 Objectives

- To develop a **VoIP communication platform** over campus Wi-Fi enabling reliable voice and text communication.
- To implement a **chatbot powered by RAG** for intelligent and accurate campus information retrieval.
- To ensure **network security and privacy** in all communications.
- To design a **sustainable, cost-effective, and scalable system** utilizing existing infrastructure.

---

## 🧩 Project Modules

### 🔊 VoIP Communication System
- Built using **Asterisk PBX**, **WebRTC**, and **SIP.js**.
- Includes failover mechanisms for **peer-to-peer fallback** communication.
- Real-time communication secured through **DTLS-SRTP** and authentication protocols.
- Features:
  - Browser-based audio calling
  - Session management
  - Adaptive codec selection (Opus, G.711)

### 🤖 RAG-Based Chatbot
- Built using **LLaMA and Qwen2.5-7B-Instruct models**.
- Local embedding via **Chroma DB** with fallback to advanced **Query Translation and Enhancement**.
- Evaluated for correctness, relevance, groundedness, and retrieval relevance.
- Embedded within the communication system UI for integrated access.

### 📺 Live Streaming Server
- Implemented with **Node.js + FFmpeg + RTMP** stack.
- Frontend built on **HTML5 with HLS** support for adaptive streaming.
- Real-time event broadcasting using **OBS Studio**.
- Includes a WebSocket-based analytics service for monitoring performance metrics.

---

## 🛡️ Network Security

- Isolated LAN deployment with no external internet dependencies.
- TLS and SRTP for encryption.
- Access-controlled user registration system.
- NAT traversal supported through STUN/TURN servers.

---

## 🧪 Evaluation Metrics

### RAG Evaluation
- **Embedding Models Compared:** `gte-Qwen2-7B-instruct`, `all-MiniLM-L6-v2`, `nomic-embed-text-v1.5`
- **Generative Models Evaluated:** `Qwen2.5`, `LLaMA 3.1`, `Phi-3-mini`, etc.
- Metrics:
  - Correctness
  - Groundedness
  - Relevance
  - Retrieval Relevance

---

## 🚀 Future Scope

- Integration with official college website.
- ML-based dynamic QoS and codec optimization.
- Enhanced live event coverage and multi-point access.
- Continuous updates to the local knowledge base for chatbot improvement.

---

## 🧑‍💻 Team

- **Aravind J L** 
- **Feba Mariyam Jacob** 
- **Johann Varghese George**
- **Sam Peter** 

---

## 🏫 Institution

**Mar Baselios College of Engineering and Technology (Autonomous)**  
Department of Computer Science and Engineering  
Thiruvananthapuram, Kerala  
Affiliated to APJ Abdul Kalam Technological University  
