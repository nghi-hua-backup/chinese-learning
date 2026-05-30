# Hệ thống học tiếng Trung

## Tổng quan

Hệ thống học tiếng Trung (Phổ thông + Quảng Đông) tích hợp Claude Code, Notion và lặp lại ngắt quãng (SM-2).

**Trạng thái hiện tại:** Tiếng Phổ thông — trình độ cơ bản (~100–300 chữ), đang theo chương trình BOYA Sơ Cấp.  
**Mục tiêu:** Thành thạo 1.000 từ vựng viết tay → HSK1 → HSK2 → HSK3.

---

## Kiến trúc hệ thống

```
Notion (nguồn dữ liệu gốc)
  └── Lessons DB → Vocabulary DB → Grammar DB
          │
          ▼ (đọc qua Notion MCP)
    Claude Code /chinese-review skill
          │
          ├── knowledge-base/kb.json      ← source of truth cho web app
          ├── knowledge-base/vocabulary.csv
          ├── knowledge-base/grammar.csv
          ├── progress/review-log.json    ← lịch sử ôn tập SRS
          ├── progress/milestones.md      ← mốc HSK
          └── practice/YYYY-MM-DD.md     ← phiếu ôn tập hằng ngày
```

---

## Workflow hằng ngày

1. **Học bài mới** → ghi chú vào Notion (Lessons + Vocabulary + Grammar)
2. **Ôn tập** → chạy `/chinese-review` trong Claude Code
   - Claude đọc Notion qua MCP
   - Tính toán từ/ngữ pháp đến hạn ôn theo SM-2
   - Sinh file `practice/YYYY-MM-DD.md`
3. **Sau ôn tập** → chạy `/chinese-review update` để ghi điểm lại vào Notion
4. **Xem tiến độ** → chạy `/chinese-review stats`

---

## Cấu trúc Notion

### Database: Bài học (Lessons)
| Trường | Kiểu |
|--------|------|
| title | title — e.g. "BOYA1 Bài 3 — Gia đình" |
| lesson_number | number |
| date_learned | date |
| course | select — "BOYA Sơ Cấp 1", "BOYA Sơ Cấp 2" |
| hsk_level | select — HSK1 / HSK2 / HSK3 |
| notes | text |

### Database: Từ vựng (Vocabulary)
| Trường | Kiểu |
|--------|------|
| simplified | title — chữ giản thể |
| traditional | text — chữ phồn thể |
| pinyin | text — có dấu thanh |
| tone_number | text — dạng số (e.g. 3-3) |
| sino_vietnamese | text — âm Hán Việt |
| meaning_vi | text — nghĩa tiếng Việt |
| part_of_speech | select |
| hsk_level | select |
| example_sentence_zh | text |
| example_sentence_vi | text |
| lesson | relation → Lessons |
| status | select — Mới / Đang học / Ôn tập / Đã thuộc |
| last_reviewed | date |
| interval_days | number |
| ease_factor | number — mặc định 2.5 |
| next_review_date | date |

### Database: Ngữ pháp (Grammar)
| Trường | Kiểu |
|--------|------|
| pattern | title — e.g. "Chủ ngữ + 是 + Tân ngữ" |
| explanation_vi | text |
| example_zh | text |
| example_vi | text |
| hsk_level | select |
| lesson | relation → Lessons |
| status | select — Mới / Đang học / Ôn tập / Đã thuộc |
| last_reviewed | date |
| interval_days | number |
| ease_factor | number |
| next_review_date | date |

---

## Thiết lập Notion MCP

### Bước 1: Tạo Notion Integration
1. Truy cập [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Tạo integration mới → đặt tên "Claude Chinese Learning"
3. Sao chép **Internal Integration Secret** (token bắt đầu bằng `secret_...`)

### Bước 2: Chia sẻ database với Integration
Với mỗi database (Lessons, Vocabulary, Grammar):
1. Mở database trong Notion
2. Click `...` (menu trên cùng bên phải) → **Connections** → chọn "Claude Chinese Learning"

### Bước 3: Thêm MCP vào Claude Code
Thêm vào `~/.claude/settings.json`:
```json
"mcpServers": {
  "notion": {
    "command": "npx",
    "args": ["-y", "@notionhq/notion-mcp-server"],
    "env": {
      "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer secret_YOUR_TOKEN_HERE\", \"Notion-Version\": \"2022-06-28\"}"
    }
  }
}
```
Thay `secret_YOUR_TOKEN_HERE` bằng token thực tế.

### Bước 4: Khởi động lại Claude Code
Sau khi lưu settings, khởi động lại Claude Code để MCP kết nối.

---

## Skill Commands

| Lệnh | Mô tả |
|------|-------|
| `/chinese-review` | Kiểm tra từ/ngữ pháp đến hạn hôm nay, sinh phiếu ôn tập |
| `/chinese-review update` | Ghi điểm ôn tập vào Notion sau buổi học |
| `/chinese-review stats` | Đánh giá năng lực: % đã thuộc theo HSK level, dự báo hoàn thành |

---

## Thuật toán SM-2 (Lặp lại ngắt quãng)

Sau mỗi lần ôn tập, đánh giá từ/ngữ pháp theo thang 0–5:
- **5** — Nhớ hoàn toàn, tức thì
- **4** — Nhớ đúng sau chút do dự
- **3** — Nhớ đúng nhưng khó khăn
- **2** — Nhớ sai, nhưng thấy đáp án quen
- **1** — Nhớ sai, đáp án trông xa lạ
- **0** — Không nhớ gì

Nếu điểm < 3: reset interval về 1 ngày.  
Nếu điểm ≥ 3: `interval_mới = interval_cũ × ease_factor`, `ease_factor` điều chỉnh theo điểm.

---

## Lộ trình học

| Giai đoạn | Mục tiêu | Công cụ |
|-----------|----------|---------|
| Hiện tại | 1.000 từ vựng viết tay | Lovable app + Notion |
| Tiếp theo | HSK1 (~150 từ) | BOYA Sơ Cấp + /chinese-review |
| Sau đó | HSK2 (~300 từ) | BOYA Sơ Cấp + SRS web app |
| Dài hạn | HSK3 (~600 từ) | BOYA Trung Cấp + SRS web app |
| Tương lai | Tiếng Quảng Đông | Chưa xác định nguồn học |
