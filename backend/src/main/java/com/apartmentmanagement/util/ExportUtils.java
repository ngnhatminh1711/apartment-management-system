package com.apartmentmanagement.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

/**
 * Utility class tạo file Excel (.xlsx) và CSV (.csv).
 *
 * Cách dùng:
 * String[] headers = {"Tên", "Email", "SĐT"};
 * List<String[]> rows = users.stream()
 * .map(u -> new String[]{u.getFullName(), u.getEmail(), u.getPhone()})
 * .toList();
 *
 * // Excel
 * return ExportUtils.buildExcelResponse("users", "Danh sách người dùng",
 * headers, rows);
 *
 * // CSV
 * return ExportUtils.buildCsvResponse("users", headers, rows);
 */
public class ExportUtils {

    private static final DateTimeFormatter FILE_DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    // ── EXCEL ────────────────────────────────────────────────────────────────

    /**
     * Build ResponseEntity chứa file Excel với 1 sheet.
     *
     * @param filePrefix tên file (không có extension, không có timestamp)
     * @param sheetTitle tiêu đề hiển thị ở dòng đầu của sheet
     * @param headers    mảng tên cột
     * @param rows       dữ liệu (mỗi phần tử là 1 dòng, mỗi dòng là String[])
     */
    public static ResponseEntity<byte[]> buildExcelResponse(
            String filePrefix,
            String sheetTitle,
            String[] headers,
            List<String[]> rows) throws IOException {

        byte[] bytes = buildExcelBytes(sheetTitle, headers, rows);
        String fileName = buildFileName(filePrefix, "xlsx");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename*=UTF-8''" + URLEncoder.encode(fileName, StandardCharsets.UTF_8))
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(bytes.length)
                .body(bytes);
    }

    /**
     * Build byte[] Excel – dùng khi cần nhiều sheet hoặc tùy chỉnh thêm.
     */
    public static byte[] buildExcelBytes(
            String sheetTitle,
            String[] headers,
            List<String[]> rows) throws IOException {

        try (XSSFWorkbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Data");

            // ── Styles ───────────────────────────────────────────────────────

            // Title style
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setWrapText(true);

            // Data style (even rows)
            CellStyle dataStyleEven = workbook.createCellStyle();
            dataStyleEven.setFillForegroundColor(IndexedColors.WHITE.getIndex());
            dataStyleEven.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            dataStyleEven.setBorderBottom(BorderStyle.THIN);
            dataStyleEven.setBorderRight(BorderStyle.THIN);

            // Data style (odd rows)
            CellStyle dataStyleOdd = workbook.createCellStyle();
            dataStyleOdd.setFillForegroundColor(IndexedColors.WHITE.getIndex());
            dataStyleOdd.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            dataStyleOdd.setBorderBottom(BorderStyle.THIN);
            dataStyleOdd.setBorderRight(BorderStyle.THIN);

            // Metadata style
            CellStyle metaStyle = workbook.createCellStyle();
            Font metaFont = workbook.createFont();
            metaFont.setItalic(true);
            metaFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
            metaStyle.setFont(metaFont);

            int rowIdx = 0;

            // ── Row 0: Title ──────────────────────────────────────────────────
            Row titleRow = sheet.createRow(rowIdx++);
            titleRow.setHeightInPoints(28);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(sheetTitle);
            titleCell.setCellStyle(titleStyle);
            if (headers.length > 1) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));
            }

            // ── Row 1: Metadata ───────────────────────────────────────────────
            Row metaRow = sheet.createRow(rowIdx++);
            Cell metaCell = metaRow.createCell(0);
            metaCell.setCellValue("Xuất lúc: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")) +
                    "  |  Tổng số: " + rows.size() + " bản ghi");
            metaCell.setCellStyle(metaStyle);
            if (headers.length > 1) {
                sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, headers.length - 1));
            }

            // ── Row 2: Empty separator ────────────────────────────────────────
            rowIdx++;

            // ── Row 3: STT + Headers ──────────────────────────────────────────
            Row headerRow = sheet.createRow(rowIdx++);
            headerRow.setHeightInPoints(24);

            // STT column
            Cell sttHeader = headerRow.createCell(0);
            sttHeader.setCellValue("STT");
            sttHeader.setCellStyle(headerStyle);
            sheet.setColumnWidth(0, 1200);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i + 1);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // ── Data rows ─────────────────────────────────────────────────────
            int stt = 1;
            for (String[] rowData : rows) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(18);
                CellStyle rowStyle = (stt % 2 == 0) ? dataStyleEven : dataStyleOdd;

                // STT
                Cell sttCell = row.createCell(0);
                sttCell.setCellValue(stt++);
                sttCell.setCellStyle(rowStyle);

                for (int i = 0; i < rowData.length; i++) {
                    Cell cell = row.createCell(i + 1);
                    cell.setCellValue(rowData[i] != null ? rowData[i] : "");
                    cell.setCellStyle(rowStyle);
                }
            }

            // ── Auto-size columns ─────────────────────────────────────────────
            for (int i = 1; i <= headers.length; i++) {
                sheet.autoSizeColumn(i);
                // Giới hạn độ rộng tối đa 8000 (khoảng 28 ký tự)
                int width = sheet.getColumnWidth(i);
                if (width < 3000)
                    sheet.setColumnWidth(i, 3000);
                if (width > 8000)
                    sheet.setColumnWidth(i, 8000);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    // ── CSV ──────────────────────────────────────────────────────────────────

    /**
     * Build ResponseEntity chứa file CSV.
     * Encode UTF-8 BOM để Excel mở đúng tiếng Việt.
     */
    public static ResponseEntity<byte[]> buildCsvResponse(
            String filePrefix,
            String[] headers,
            List<String[]> rows) {

        byte[] bytes = buildCsvBytes(headers, rows);
        String fileName = buildFileName(filePrefix, "csv");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename*=UTF-8''" + URLEncoder.encode(fileName, StandardCharsets.UTF_8))
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .contentLength(bytes.length)
                .body(bytes);
    }

    /**
     * Build byte[] CSV với UTF-8 BOM.
     */
    public static byte[] buildCsvBytes(String[] headers, List<String[]> rows) {
        StringBuilder sb = new StringBuilder();

        // Header row
        sb.append(escapeCsvRow(headers)).append("\n");

        // Data rows
        int stt = 1;
        for (String[] row : rows) {
            // Prepend STT
            String[] withStt = new String[row.length + 1];
            withStt[0] = String.valueOf(stt++);
            System.arraycopy(row, 0, withStt, 1, row.length);
            sb.append(escapeCsvRow(withStt)).append("\n");
        }

        // UTF-8 BOM + content
        byte[] bom = new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };
        byte[] content = sb.toString().getBytes(StandardCharsets.UTF_8);
        byte[] result = new byte[bom.length + content.length];
        System.arraycopy(bom, 0, result, 0, bom.length);
        System.arraycopy(content, 0, result, bom.length, content.length);
        return result;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static String escapeCsvRow(String[] fields) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fields.length; i++) {
            if (i > 0)
                sb.append(',');
            String val = fields[i] != null ? fields[i] : "";
            // Escape: nếu có dấu phẩy, ngoặc kép, hoặc xuống dòng → bọc trong ""
            if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
                val = "\"" + val.replace("\"", "\"\"") + "\"";
            }
            sb.append(val);
        }
        return sb.toString();
    }

    private static String buildFileName(String prefix, String extension) {
        return prefix + "_" + LocalDateTime.now().format(FILE_DATE_FMT) + "." + extension;
    }

    // ── Number formatting helpers ─────────────────────────────────────────────

    /** Format số tiền theo định dạng Việt Nam */
    public static String fmtMoney(java.math.BigDecimal amount) {
        if (amount == null)
            return "0";
        return String.format("%,.0f", amount.doubleValue());
    }

    /** Format LocalDate → dd/MM/yyyy */
    public static String fmtDate(java.time.LocalDate date) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    /** Format LocalDateTime → dd/MM/yyyy HH:mm */
    public static String fmtDateTime(java.time.LocalDateTime dt) {
        if (dt == null)
            return "";
        return dt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    /** Format billing month LocalDate (ngày 1 của tháng) → MM/yyyy */
    public static String fmtBillingMonth(java.time.LocalDate date) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern("MM/yyyy"));
    }

    /** Null-safe string */
    public static String safe(String s) {
        return s != null ? s : "";
    }

    /** Null-safe string từ Object.toString() */
    public static String safe(Object o) {
        return o != null ? o.toString() : "";
    }
}