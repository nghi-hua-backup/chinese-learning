# Hướng dẫn: Hệ thống Ôn tập Ngắt quãng (SRS)

Tài liệu này giải thích toàn bộ logic của hệ thống SRS trong ứng dụng — từ thuật toán đến từng nút bấm trên trang **Tiến độ**.

---

## 1. Thuật toán — FSRS

Ứng dụng dùng thuật toán **FSRS** (Free Spaced Repetition Scheduler, thư viện `ts-fsrs`). FSRS tiên tiến hơn SM-2 (Anki cổ điển) vì nó mô hình hóa xác suất nhớ thực tế.

**Cấu hình mặc định:**
- Mục tiêu nhớ: **90%** (ôn đúng hạn thì xác suất nhớ ≥ 90%)
- Khoảng cách tối đa: 36 500 ngày (~100 năm)
- **Fuzzing bật** — khoảng cách ≥ 2,5 ngày được cộng thêm một số ngẫu nhiên nhỏ để tránh nhiều thẻ đến hạn cùng lúc

---

## 2. Trạng thái thẻ

Mỗi thẻ có một trong 4 trạng thái:

| Trạng thái | Số | Ý nghĩa |
|---|---|---|
| **New** | 0 | Chưa ôn lần nào (`reps = 0`) |
| **Learning** | 1 | Đang học lần đầu, khoảng cách tính bằng phút |
| **Review** | 2 | Đã nắm, khoảng cách tính bằng ngày/tuần/tháng |
| **Relearning** | 3 | Đã quên (bấm "Lại"), đang học lại, khoảng cách bằng phút |

### Luồng chuyển trạng thái

```
[New]
  │  (lần ôn đầu tiên)
  ▼
[Learning]  ←──────────────────────────────────┐
  │  Tốt/Dễ nhiều lần                          │
  ▼                                            │
[Review]  ──── bấm "Lại" ────► [Relearning] ──┘
              (lapse)
```

Mỗi lần bấm **"Lại"** trên thẻ ở trạng thái Review được ghi là một **lapse** — ảnh hưởng đến độ chính xác và làm thẻ khó hơn.

---

## 3. Nút đánh giá: Lại / Khó / Tốt / Dễ

Sau mỗi thẻ (chế độ tự đánh giá), bạn chọn một trong 4 mức:

| Nút | Rating | Ý nghĩa | Khoảng cách điển hình |
|---|---|---|---|
| **Lại** | 1 (Again) | Không nhớ gì | ~1 phút |
| **Khó** | 2 (Hard) | Nhớ ra nhưng khó khăn | ~6–10 phút |
| **Tốt** | 3 (Good) | Nhớ bình thường | Vài ngày (lần đầu); dài hơn mỗi lần sau |
| **Dễ** | 4 (Easy) | Nhớ ngay lập tức | Vài tuần trở lên |

> **Chế độ Trắc nghiệm:** hệ thống tự đánh giá — đúng = **Tốt (3)**, sai = **Lại (1)**. Không cần bấm tay.
>
> **Chế độ Viết tay:** bạn tự đánh giá sau khi xem đáp án.

Khoảng thời gian thực tế do thuật toán FSRS tính dựa trên lịch sử ôn tập của từng thẻ — không phải con số cố định.

---

## 4. Trang Tiến độ — từng phần

### 4.1 Thống kê tổng quan (4 ô trên cùng)

| Ô | Hiển thị gì |
|---|---|
| 🔥 Ngày liên tiếp | Số ngày ôn liên tục (reset nếu bỏ 1 ngày) |
| 📝 Tổng lần ôn | Tổng số lần đánh giá tất cả thẻ |
| 🎯 Độ chính xác | `(tổng lần ôn − tổng lapse) / tổng lần ôn × 100%` |
| 📅 Cần ôn hôm nay | Số thẻ đến hạn hôm nay (cả từ vựng + mẫu câu) |

### 4.2 Tiến độ Từ vựng / Mẫu câu

Ba dòng cho mỗi loại:

| Dòng | Điều kiện |
|---|---|
| **Đã học** | Thẻ có `reps > 0` (đã ôn ít nhất 1 lần) |
| **Thẻ mới** | Thẻ có `reps = 0` (chưa ôn lần nào) |
| **Cần ôn hôm nay** | Thẻ mà `ngày đến hạn ≤ thời điểm hiện tại` |

### 4.3 Tiến độ theo bài

Mỗi bài học hiển thị số thẻ đã học / tổng thẻ, kèm thanh tiến độ.  
"Đã học" = thẻ có `reps > 0`.

### 4.4 Thẻ sắp đến hạn

**Cách danh sách được tạo:**
1. Lấy tất cả thẻ có `reps > 0` (chỉ thẻ đã từng ôn — thẻ mới không xuất hiện đây)
2. Sắp xếp tăng dần theo ngày đến hạn (gần nhất lên đầu)
3. Hiển thị tối đa **8 thẻ**

**Badge màu sắc:**

| Badge | Màu | Điều kiện |
|---|---|---|
| **Cần ôn ngay** | Đỏ | `số ngày đến hạn ≤ 0` (đã đến hạn hoặc quá hạn) |
| **+N ngày** | Cam | Còn 1 ngày |
| **+N ngày** | Xám | Còn nhiều hơn 1 ngày |

> "Cần ôn ngay" trong danh sách này chỉ là nhãn thông tin — để bắt đầu ôn thực sự, bấm nút **"Ôn ngay"** màu xanh ở trên.

---

## 5. Nút "Ôn ngay" — logic đầy đủ

### Khi nào nút xuất hiện?

Nút **"Ôn ngay"** chỉ hiện khi:
```
số thẻ đã ôn (reps > 0) VÀ đến hạn (due ≤ now) > 0
```

Nếu bạn chưa ôn bất kỳ thẻ nào (toàn bộ là thẻ mới), nút **không xuất hiện** dù "Cần ôn hôm nay" > 0.

### Thẻ nào được đưa vào phiên "Ôn ngay"?

| | Thẻ mới (reps = 0) | Thẻ đã ôn + đến hạn (reps > 0, due ≤ now) | Thẻ đã ôn nhưng chưa đến hạn |
|---|---|---|---|
| **Phiên thường** (vào Từ vựng bình thường) | ✅ Có | ✅ Có | ❌ Không |
| **Phiên "Ôn ngay"** | ❌ Không | ✅ Có | ❌ Không |

"Ôn ngay" chỉ lấy thẻ **đã học trước đây và nay đến hạn ôn lại** — không thêm thẻ mới.

### Luồng khi bấm "Ôn ngay":

1. Chuyển sang trang Từ vựng với tham số `?autostart=1`
2. Trang tự bỏ qua màn hình chọn bài/chế độ
3. Mở thẳng phiên **Trắc nghiệm** (`reviewOnly = true`)
4. Hệ thống lấy đúng danh sách thẻ quá hạn để ôn
5. Sau khi hoàn thành, hiện màn hình tổng kết

---

## 6. Dữ liệu lưu trữ

Tất cả tiến độ lưu trong **localStorage** của trình duyệt, key: `chinese-srs-progress`.

Mỗi thẻ lưu:

| Trường | Ý nghĩa |
|---|---|
| `due` | Thời điểm đến hạn (ISO datetime) |
| `stability` | Độ bền ký ức — càng cao, khoảng cách ôn càng dài |
| `difficulty` | Độ khó thẻ (thang 1–10) |
| `reps` | Tổng số lần ôn |
| `lapses` | Số lần bấm "Lại" khi thẻ ở trạng thái Review |
| `state` | Trạng thái hiện tại (0–3) |
| `last_review` | Thời điểm ôn gần nhất |

> **Lưu ý:** Tiến độ chỉ tồn tại trên thiết bị hiện tại. Xóa cache trình duyệt = mất toàn bộ tiến độ.

---

## 7. Kịch bản kiểm tra

Dùng các kịch bản sau để xác nhận bạn hiểu đúng logic. Mỗi kịch bản mô tả: điều kiện ban đầu → hành động → kết quả mong đợi.

---

### Kịch bản 1: Thẻ mới — "Ôn ngay" chưa xuất hiện

**Điều kiện:** Chưa ôn thẻ nào (tài khoản mới hoặc sau khi Reset tiến độ).

**Hành động:** Vào trang **Tiến độ**.

**Kết quả mong đợi:**
- Nút "Ôn ngay" **không xuất hiện**
- Mục "Đã học" = 0
- Mục "Thẻ mới" = tổng số thẻ
- "Thẻ sắp đến hạn" **trống** (vì chưa có thẻ nào `reps > 0`)

---

### Kịch bản 2: Ôn thẻ lần đầu → thẻ chuyển sang Learning

**Điều kiện:** Thẻ "你好" chưa ôn lần nào (New).

**Hành động:** Vào Từ vựng → bắt đầu phiên → gặp thẻ "你好" → chọn **Tốt**.

**Kết quả mong đợi:**
- Thẻ "你好" chuyển sang trạng thái **Learning** (reps = 1)
- Thẻ xuất hiện lại sau ~10 phút trong cùng phiên (nếu tiếp tục)
- Trên trang Tiến độ: "Đã học" tăng 1, "Thẻ mới" giảm 1
- Thẻ **chưa xuất hiện** trong "Thẻ sắp đến hạn" ngay lập tức (vì chưa đến hạn ngay)

---

### Kịch bản 3: "Ôn ngay" xuất hiện sau khi thẻ đến hạn

**Điều kiện:** Đã ôn một số thẻ trước đó (reps > 0). Các thẻ đó có ngày đến hạn đã qua.

**Hành động:** Vào trang **Tiến độ**.

**Kết quả mong đợi:**
- Nút "Ôn ngay" **xuất hiện** với số thẻ quá hạn
- Các thẻ quá hạn hiển thị badge đỏ **"Cần ôn ngay"** trong "Thẻ sắp đến hạn"
- Bấm "Ôn ngay" → vào phiên Trắc nghiệm ngay, không qua màn hình chọn bài

> **Cách kiểm tra nhanh không cần chờ:** Sau khi ôn một số thẻ và cho điểm "Lại" liên tục (rating 1), khoảng cách chỉ 1 phút — chờ 1 phút rồi vào lại trang Tiến độ, nút "Ôn ngay" sẽ xuất hiện.

---

### Kịch bản 4: Badge "Cần ôn ngay" trong danh sách Thẻ sắp đến hạn

**Điều kiện:** Có ít nhất một thẻ đã ôn và đã quá hạn.

**Hành động:** Vào trang **Tiến độ**, kéo xuống phần "Thẻ sắp đến hạn".

**Kết quả mong đợi:**
- Thẻ quá hạn nằm ở **đầu danh sách** (sắp xếp theo gần nhất)
- Badge hiển thị **"Cần ôn ngay"** màu đỏ (không phải "+N ngày")
- Thẻ chưa ôn lần nào **không xuất hiện** trong danh sách này

---

### Kịch bản 5: Lapse — bấm "Lại" trên thẻ Review

**Điều kiện:** Thẻ đang ở trạng thái **Review** (đã ôn nhiều lần, khoảng cách vài ngày trở lên).

**Hành động:** Trong phiên tự đánh giá (Viết tay), gặp thẻ đó → bấm **Lại**.

**Kết quả mong đợi:**
- Thẻ chuyển sang **Relearning** (lapses tăng 1)
- Thẻ xuất hiện lại sau ~10 phút
- Độ chính xác trên trang Tiến độ **giảm** (vì lapses tăng)
- Khoảng cách lần sau sẽ ngắn hơn so với trước khi lapse

---

## Tóm tắt nhanh

```
Thẻ mới (reps=0)
  → Phiên thường: có mặt
  → "Ôn ngay": KHÔNG có mặt
  → "Thẻ sắp đến hạn": KHÔNG có mặt

Thẻ đã ôn + còn hạn (reps>0, due > now)
  → Phiên thường: KHÔNG (chưa đến hạn)
  → "Ôn ngay": KHÔNG
  → "Thẻ sắp đến hạn": CÓ (hiện "+N ngày")

Thẻ đã ôn + quá hạn (reps>0, due ≤ now)
  → Phiên thường: CÓ
  → "Ôn ngay": CÓ ← nút xuất hiện vì nhóm này
  → "Thẻ sắp đến hạn": CÓ (hiện "Cần ôn ngay" đỏ)
```
