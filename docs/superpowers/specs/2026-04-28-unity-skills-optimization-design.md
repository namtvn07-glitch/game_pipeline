# Master Skill Tokenization & Routing Optimization

## 1. Goal
Tối ưu hóa bộ kỹ năng quản lý Unity Development (`game-dev-unity`), chuyển đổi từ một cấu trúc văn bản/bảng biểu nặng token sang một kiến trúc Mermaid Flowchart trực quan và tiết kiệm token nhất. Hệ thống lưu trữ các tập tin hỗ trợ cần được làm tinh gọn, xóa bỏ các trường dữ liệu tĩnh dư thừa trong thời đại LLM.

## 2. Architecture & Components

### The Master Router (`game-dev-unity/SKILL.md`)
Thay thế dạng Table truyền thống bằng Node-based Flowchart với công nghệ `mermaid`. 
- **Chức năng**: LLM và Con người có thể "nhìn phát hiểu luôn" cấu trúc cây phân nhánh đính kèm của 4 kỹ năng mảng phụ.
- **Biểu đồ Cú pháp**: Sử dụng Markdown có Codeblock `mermaid`, tích hợp `graph TD` và đường nối Node `-->`.

### The Trimmed Sub-Files 
Các tệp như `unity-safe-scripting.md`, `unity-physics.md` hiện tại đang đóng vai mã giả lập kỹ năng độc lập, chúng có nhiều keyword định tuyến không còn cần thiết.

- Xóa khối `<yaml>` `--- name: ... description: ... ---` (Tiết kiệm ~200 kí tự).
- Xóa Header Title cấp 1 `# Unity...`.
- Xóa Mục `## Overview` và `## When to use` (Vì Master Router đã gánh trách nhiệm kiểm tra khi nào nên dùng).
- Đẩy toàn phần vào nhánh `## Core Patterns` với bảng chống Ngụy biện `Rationalizations`.

## 3. Data Flow
1. LLM nhận lệnh từ Human Partner.
2. LLM dò Semantic Search trúng `game-dev-unity`.
3. LLM mở tệp `SKILL.md`. Bộ phân tích ngôn ngữ đồ hoạ bắt các Node Mermaid và nhận diện `Category`.
4. LLM tải chính xác 1 trong 4 file `.md` bổ trợ nội bộ.
5. LLM đối chiếu quy tắc Cấm / Áp dụng từ `Core Patterns` rồi mới code.

## 4. Verification Plan
- Phải đảm bảo Mermaid Script dịch thuật chính xác trên giao diện Github Preview hoặc IDE có plugin Markdown preview.
- Đảm bảo AI sau khi đọc file đã lược giản không bị "Lack Context" mà viết code sai chuẩn. Mất đi tiêu đề có làm nó nhầm sang ngôn ngữ Godot / Unreal hay ko? (Cách giải quyết: Tên file đã giữ `unity-` ở đầu).
