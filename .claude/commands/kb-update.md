# /kb-update — Knowledge Base Manager

> **Note:** For interactive KB updates with full Gatekeeper → Debator → Writer → Checker workflow, use `/kb-intake`. This skill is the direct writer phase only, used internally by `/kb-intake` or for unattended batch updates (e.g., processing a single lesson image with no prior KB conflicts expected).


Cập nhật `chinese-brain.md` và `chinese-practice-bank.md` từ ảnh bài học mới.

Also available as `/lesson` (friendlier alias for the same workflow).

## Cách dùng

```
/kb-update <tên_file_ảnh>
/kb-update IMG_8025.jpeg
/kb-update IMG_8025.jpeg IMG_8026.jpeg IMG_8027.jpeg
```

Nếu không truyền tên file, hỏi người dùng file nào cần xử lý.

---

## Quy trình thực hiện

### Bước 1 — Đọc tài liệu hướng dẫn

Đọc file này trước khi làm bất cứ điều gì:

```
chinese-learning/knowledge-base/chinese-brain-guide.md
```

Đây là nguồn quy tắc duy nhất. Không suy đoán định dạng từ bộ nhớ.

### Bước 2 — Đọc ảnh bài học

Đọc toàn bộ ảnh được truyền vào từ thư mục:

```
chinese-learning/references/<tên_file>
```

Với nhiều ảnh: đọc tất cả trước khi bắt đầu cập nhật.

Từ ảnh, trích xuất:
- Số bài (Bài N) — thường ghi ở đầu trang
- Từ vựng mới: 简体, 繁體, pinyin, Hán Việt, từ loại, nghĩa
- Quy tắc phát âm / biến điệu mới (nếu có)
- Pattern ngữ pháp mới: cấu trúc + giải thích + ví dụ
- Câu bài tập (BTVN), hội thoại, câu luyện nghe

### Bước 3 — Đọc chinese-brain.md hiện tại

```
chinese-learning/knowledge-base/chinese-brain.md
```

Xác định:
- Bài học cuối đã có là bài mấy
- Từ nào đã tồn tại (để tránh trùng lặp)
- Vị trí cuối của mỗi section để append đúng chỗ

### Bước 4 — Cập nhật các file

Thêm nội dung mới vào đúng file và section theo quy tắc trong guide:

| Loại nội dung | File | Section |
|---|---|---|
| Quy tắc phát âm/biến điệu mới | `chinese-brain.md` | **Phát âm** |
| Từ vựng mới | `chinese-brain.md` | **Từ vựng** → thêm sub-heading `### Bài N` nếu chưa có |
| Số, ngày, thứ mới | `chinese-brain.md` | **Số đếm & Thời gian** |
| Lượng từ mới | `chinese-brain.md` | **Lượng từ** |
| Pattern ngữ pháp mới | `chinese-brain.md` | **Ngữ pháp** |
| Câu bài tập / hội thoại | `chinese-practice-bank.md` | thêm sub-heading `### Bài N` nếu chưa có |

**Quy tắc bắt buộc:**
- Áp dụng quy tắc 简体/繁體: nếu giản thể == phồn thể → cột 简体 để `—`
- Không xoá nội dung cũ
- Không thêm entry đã tồn tại (kiểm tra bằng cột 繁體)
- Cập nhật dòng `> **Cập nhật lần cuối:**` ở đầu **cả hai** file được chỉnh sửa

### Bước 5 — Báo cáo kết quả

Sau khi hoàn thành, báo cáo ngắn gọn:

```
✓ Đã cập nhật từ [tên file(s)]
  - chinese-brain.md: X từ vựng, Y pattern ngữ pháp
  - chinese-practice-bank.md: Z câu luyện tập
  - Bỏ qua: K entry đã tồn tại (nếu có)
```

### Bước 6 — Tạo khối Luyện tập tổng hợp

Sau khi Bước 4 hoàn tất, đọc toàn bộ `chinese-brain.md` đã cập nhật và tạo một khối luyện tập tổng hợp mới.

**Quy trình:**

1. Xác định số bài hiện tại (N) từ các sub-heading `### Bài N` trong section Từ vựng.
2. Soạn 3–5 tình huống hội thoại thực tế, mỗi tình huống 4–8 câu:
   - Mỗi tình huống phải dùng từ vựng hoặc ngữ pháp từ **ít nhất 2 bài khác nhau**
   - Ít nhất 1 tình huống phải chứa một **pattern ngữ pháp** từ section Ngữ pháp
   - Tên tình huống mô tả hoàn cảnh thực tế (ví dụ: "Gặp gỡ đồng nghiệp mới"), không mô tả ngữ pháp
   - Câu phải tự nhiên và hơi phức tạp hơn ví dụ từng bài (câu dài hơn, kết hợp nhiều mệnh đề)
3. Định dạng thành khối theo cấu trúc sau:

```markdown
### Cập nhật sau Bài N — YYYY-MM-DD

**Kiến thức sử dụng:** Bài 1 (…) + Bài 2 (…) + … + Bài N (…)

#### Tình huống 1: [Tên tình huống]

| 简体 | 繁體 | Pinyin | Nghĩa (Tiếng Việt) |
|------|------|--------|--------------------|
| … | … | … | … |

#### Tình huống 2: [Tên tình huống]
…
```

4. **Chèn khối mới** vào `chinese-practice-bank.md` ngay sau dòng `## Luyện tập tổng hợp`, trước dòng `<!-- future lessons will be prepended above this comment -->`. Không xoá các khối cũ.
5. Áp dụng quy tắc 简体/繁體: nếu câu giản thể và phồn thể **giống nhau hoàn toàn** → để `—` ở cột 简体.
6. Cập nhật dòng `> **Cập nhật lần cuối:**` ở đầu `chinese-practice-bank.md` nếu chưa cập nhật ở Bước 4.
7. Thêm vào báo cáo cuối: `- Luyện tập tổng hợp: X tình huống mới (Bài N)`

### Bước 7 — Cập nhật CHANGELOG.md (P11 — bắt buộc)

Trước khi commit, cập nhật `chinese-app/docs/CHANGELOG.md`:

1. Đọc entry đầu tiên trong CHANGELOG.md để lấy version hiện tại.
2. Tăng PATCH version (ví dụ: 1.0.2 → 1.0.3).
3. Thêm entry mới vào đầu file theo định dạng:
   ```
   ## [x.y.z] - YYYY-MM-DD
   ### Added
   - KB: Bài N — X từ vựng, Y pattern ngữ pháp, Z câu luyện tập
   ```

### Bước 8 — Commit và push

Sau khi hoàn thành tất cả cập nhật và báo cáo kết quả:

```
git add chinese-learning/knowledge-base/chinese-brain.md
git add chinese-learning/knowledge-base/chinese-practice-bank.md
git add chinese-app/docs/CHANGELOG.md
git commit -m "kb: add Bài N content (X từ vựng, Y ngữ pháp, Z câu luyện tập)"
git push origin main
```

GitHub Actions sẽ tự động rebuild và redeploy. Thông báo cho người dùng:
"Nội dung Bài N đã được cập nhật và deploy tại: https://nghi-hua-backup.github.io/chinese-learning/"

---

## Xử lý trường hợp đặc biệt

**Không xác định được số bài:**
→ Suy ra từ thứ tự file (ảnh sau IMG cuối cùng đã có) hoặc hỏi người dùng.

**Entry trùng lặp:**
→ Bỏ qua hoàn toàn, đừng ghi đè. Ghi vào báo cáo.

**Chữ khó đọc trong ảnh:**
→ Ghi placeholder `[?]` vào ô đó, ghi chú ở cuối báo cáo để người dùng xác nhận.

**Pinyin không chắc thanh điệu:**
→ Ghi `[pinyin?]` và liệt kê vào báo cáo.
