# Hướng dẫn cập nhật chinese-brain.md

Đây là tài liệu hướng dẫn để Claude đọc trước khi cập nhật `chinese-brain.md`. Mục đích là đảm bảo mọi lần cập nhật đều nhất quán về định dạng, ngôn ngữ, và cách phân loại.

---

## 1. Mục đích của các file

`chinese-brain.md` là file "bộ não" tổng hợp toàn bộ kiến thức tiếng Trung đã học. Nó phục vụ hai mục đích:

1. **Tra cứu nhanh** — từ vựng, ngữ pháp, phát âm luôn ở một nơi
2. **Tham chiếu cho luyện tập** — link sang `chinese-practice-bank.md`

`chinese-practice-bank.md` là file riêng chứa toàn bộ câu ví dụ, bài tập (BTVN), và hội thoại. Khi người dùng yêu cầu sinh câu luyện tập, Claude đọc file này.

---

## 2. Từ viết tắt (Abbreviation Key)

| Viết tắt | Ý nghĩa đầy đủ | Ghi chú |
|----------|---------------|---------|
| DT | Danh từ | |
| ĐT / V | Động từ | Dùng V trong công thức ngữ pháp |
| HDT | Hình dung từ | Tính từ/trạng từ mô tả |
| PT | Phó từ | Trạng từ bổ nghĩa cho ĐT hoặc HDT |
| S | Chủ ngữ | Subject |
| O | Tân ngữ | Object |
| Trợ từ | Trợ từ | Không viết tắt |
| Đại từ nhân xưng | Đại từ nhân xưng | Không viết tắt (tôi, bạn, anh ấy…) |
| Đại từ nghi vấn | Đại từ nghi vấn | Không viết tắt (ai, đâu, mấy…) |

---

## 3. Quy tắc định dạng

### Chữ Hán
- Luôn có **cả hai** cột: 简体 (giản thể) và 繁體 (phồn thể)
- Nếu giản thể và phồn thể **giống nhau** → để `—` ở cột 简体, giữ chữ ở cột 繁體
- Nếu giản thể và phồn thể **khác nhau** → ghi cả hai
- Ví dụ đúng: 妈妈 / 媽媽 (khác) → ghi cả hai; 爸爸 (giống) → `—` | 爸爸
- Quy tắc này áp dụng cho cả từ đơn và câu nguyên văn trong Practice Bank

### Pinyin
- Luôn dùng dấu thanh điệu (tone marks): ā á ǎ à, không dùng số (a1 a2…)
- Đặt trong cặp dấu / / để phân biệt, ví dụ: /hànyǔ/
- Nếu không chắc thanh điệu, để placeholder `[pinyin?]` và ghi chú

### Hán Việt
- Viết hoa chữ đầu mỗi từ, ví dụ: Hán Ngữ, Học Sinh, Ngân Hàng
- Nếu không có âm Hán Việt thông dụng, ghi dấu `—`

### Nghĩa tiếng Việt
- Ngắn gọn, dùng dấu phẩy nếu có nhiều nghĩa
- Ưu tiên nghĩa phổ thông nhất lên đầu

---

## 4. Quy tắc phân loại (nội dung vào section nào)

| Loại nội dung | Section |
|--------------|---------|
| Quy tắc pinyin, biến điệu thanh điệu | **Phát âm** |
| Từ vựng thông thường (DT, ĐT, HDT, PT, đại từ…) | **Từ vựng** — dưới sub-heading `### Bài N` |
| Số đếm (一二三…), số thứ tự, hỏi số lượng (几), ngày/tháng/năm, hôm nay/hôm qua/ngày mai, thứ trong tuần | **Số đếm & Thời gian** |
| Lượng từ (个/個, 口…) và quy tắc dùng lượng từ | **Lượng từ** |
| Công thức câu, cấu trúc ngữ pháp | **Ngữ pháp** — dưới sub-heading `### [Tên pattern]` |
| Câu chào hỏi, tạm biệt, xin lỗi, cảm ơn, xã giao | **Câu thông dụng** |
| Câu ví dụ từ bài tập (BTVN), hội thoại từ bài nghe | **Ngân hàng câu luyện tập** — dưới sub-heading `### Bài N` |

**Lưu ý đặc biệt:**
- 口 (miệng) là DT thông thường → **Từ vựng**; nhưng khi dùng đếm người (几口人) → **Lượng từ**
- 在 có thể là ĐT (ở) hoặc giới từ (đang) → đưa vào **Từ vựng** và ghi rõ cả hai vai trò; cấu trúc 在+place+V → **Ngữ pháp**

---

## 5. Quy trình cập nhật sau mỗi bài học mới

1. **Đọc ảnh** — đọc toàn bộ nội dung ảnh mới, xác định số bài (Bài N)
2. **Đọc guide này** — để nhớ lại quy tắc
3. **Đọc chinese-brain.md** — để biết đã có gì, tránh trùng lặp
4. **Trích xuất nội dung:**
   - Từ vựng mới → thêm vào Section **Từ vựng** dưới `### Bài N`
   - Số/thời gian mới → thêm vào Section **Số đếm & Thời gian**
   - Lượng từ mới → thêm vào Section **Lượng từ**
   - Pattern ngữ pháp mới → thêm vào Section **Ngữ pháp**
   - Câu thoại/bài tập → thêm vào **`chinese-practice-bank.md`** dưới `### Bài N` (KHÔNG thêm vào chinese-brain.md)
5. **Kiểm tra trước khi ghi** (xem Mục 6)
6. **Ghi cả hai file** nếu có câu mới, báo cáo: N từ vựng, M pattern ngữ pháp, K câu luyện tập đã thêm

**Không bao giờ:**
- Xoá nội dung cũ
- Thay đổi format của các entry đã có
- Thêm entry trùng lặp (kiểm tra bằng cách tìm 简体 đã tồn tại chưa)

---

## 6. Checklist kiểm tra trước khi ghi

- [ ] Mỗi từ vựng có đủ 6 cột: 简体, 繁體, Pinyin, Hán Việt, Từ loại, Nghĩa
- [ ] Pinyin có dấu thanh điệu (không dùng số)
- [ ] Cột 简体: `—` nếu giản thể == phồn thể; chữ giản thể nếu khác phồn thể
- [ ] Hán Việt viết hoa chữ đầu
- [ ] Không có dòng trùng lặp với nội dung đã có trong file
- [ ] Câu ví dụ trong Ngữ pháp có cả 简体, 繁體, pinyin, và nghĩa tiếng Việt
- [ ] Câu trong Ngân hàng luyện tập có cả 4 cột

---

## 7. Ví dụ minh hoạ đúng/sai

### Từ vựng — ĐÚNG (khác nhau)
```
| 银行 | 銀行 | yínháng | Ngân Hàng | DT | ngân hàng |
```

### Từ vựng — ĐÚNG (giống nhau → dùng —)
```
| — | 爸爸 | bàba | — | DT | bố, ba, cha |
```

### Từ vựng — SAI (thiếu phồn thể, pinyin không dấu)
```
| 银行 | | yinhang | ngân hàng | DT | ngân hàng |
```

### Ngữ pháp — ĐÚNG
```
### Câu phủ định với 不
**Cấu trúc:** S + 不 + HDT/V
**Giải thích:** Phủ định hình dung từ hoặc động từ
**Ví dụ:**
- 马不大。/ 馬不大。 /mǎ bù dà/ — Con ngựa không to.
```
