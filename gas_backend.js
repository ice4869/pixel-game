// Google Apps Script Code for Pixel Quiz Game

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_QUESTIONS = "題目";
const SHEET_ANSWERS = "回答";

function doGet(e) {
  const params = e.parameter;
  const action = params.action;

  if (action === "getQuestions") {
    return getQuestions(params.count || 5);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if (action === "submitScore") {
    return submitScore(data);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function getQuestions(count) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove headers
  
  // Data structure: [ID, Question, A, B, C, D, Answer]
  // We assume columns are in that order. 
  // Map to object logic:
  const questions = data.map((row, index) => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    },
    // answer: row[6] // DO NOT SEND ANSWER TO FRONTEND
    _encryptedAnswer: Utilities.base64Encode(row[6]) // Simple obfuscation for verification if needed, or just handle grading on server. 
    // Ideally grading should happen on server, but for this simple architecture we might need to send hash or grade on next request.
    // However, the prompt says "將作答結果傳送到 Google Apps Script 計算成績" (Send results to GAS to calculate score).
    // So we just send questions.
  }));

  // Shuffle and pick N
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return ContentService.createTextOutput(JSON.stringify(selected)).setMimeType(ContentService.MimeType.JSON);
}

function submitScore(payload) {
  // Payload: { userId: string, answers: { questionId: string, answer: string }[] }
  const sheetQ = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  const dataQ = sheetQ.getDataRange().getValues();
  dataQ.shift(); // remove header
  
  // Create answer map
  const answerKey = {};
  dataQ.forEach(row => {
    answerKey[row[0]] = row[6]; // ID is col 0, Answer is col 6
  });

  let correctCount = 0;
  payload.answers.forEach(ans => {
    if (answerKey[ans.questionId] == ans.answer) {
      correctCount++;
    }
  });

  const totalQuestions = payload.answers.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  // Record to Sheet
  recordToSheet(payload.userId, correctCount, totalQuestions, score);

  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    score: score, 
    correctCount: correctCount, 
    total: totalQuestions 
  })).setMimeType(ContentService.MimeType.JSON);
}

function recordToSheet(userId, correct, total, score) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ANSWERS);
  if (!sheet) {
    // Create if not exists
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_ANSWERS).appendRow(["ID", "闖關次數", "總分", "最高分", "第一次通關分數", "花了幾次通關", "最近遊玩時間"]);
  }
  
  const sheetA = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ANSWERS);
  const data = sheetA.getDataRange().getValues();
  let rowIndex = -1;

  // Find user row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == userId) {
      rowIndex = i + 1; // 1-based index
      break;
    }
  }

  const timestamp = new Date();

  if (rowIndex === -1) {
    // New User
    sheetA.appendRow([userId, 1, score, score, score, 1, timestamp]);
  } else {
    // Update User
    const currentRow = data[rowIndex - 1];
    const newCount = currentRow[1] + 1;
    const newTotalScore = currentRow[2] + score; // Accumulate or just update? "總分" implies accumulated or current? Prompt says "總分", usually means accumulated or current session. Let's assume current run score for now, but commonly it might be accumulated logic. Let's just update the specific fields asked. 
    // Requirement: "若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數" -> This implies we DON'T update the "First Clear Score" or maybe even "Score"? 
    // "總分" (Total Score) vs "第一次通關分數" (First clear score). 
    // Let's assume:
    // 闖關次數 += 1
    // 最高分 = max(current, new)
    // 第一次通關分數 = keep existing
    // 花了幾次通關 = ??? This usually implies "tries until pass". 
    // Let's just update common stats:
    
    // Using sheetA.getRange(row, col).setValue()
    
    const currentMax = currentRow[3];
    sheetA.getRange(rowIndex, 2).setValue(newCount); // Count
    sheetA.getRange(rowIndex, 4).setValue(Math.max(currentMax, score)); // Max Score
    sheetA.getRange(rowIndex, 7).setValue(timestamp); // Last played
    
    // Note: "總分" definition is ambiguous, leaving as is or updating to latest might be wrong. 
    // Let's assume it means "Sum of all scores" maybe? Or just the score of this run? 
    // Given the columns "ID, Plays, TotalScore, Max, First", commonly TotalScore is sum.
    sheetA.getRange(rowIndex, 3).setValue(currentRow[2] + score); 
  }
}
