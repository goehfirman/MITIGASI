"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  QuizQuestion, 
  getRandomQuizQuestions, 
  QUIZ_BANK 
} from '@/lib/quiz-data';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  House, 
  HelpCircle, 
  User, 
  Trophy, 
  BookOpen, 
  CheckSquare, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizHistoryItem {
  id: string;
  name: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  date: string;
}

export default function QuizApp() {
  const [stage, setStage] = useState<'start' | 'quiz' | 'result' | 'review'>('start');
  const [studentName, setStudentName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Active quiz session state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  // Load existing student name and history from localStorage on mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('geo_student_name');
      if (savedName) setStudentName(savedName);

      const savedHistory = localStorage.getItem('geo_quiz_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const handleStartQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = studentName.trim();
    if (!cleanName) {
      setNameError('Silakan ketikkan namamu terlebih dahulu untuk memulai!');
      return;
    }
    setNameError('');

    // Save student name to localStorage
    try {
      localStorage.setItem('geo_student_name', cleanName);
    } catch {}

    // Randomize 10 questions from the 50 bank
    const sampled = getRandomQuizQuestions(10);
    setQuestions(sampled);
    setAnswers(new Array(sampled.length).fill(null));
    setCurrentIndex(0);
    setStage('quiz');
  };

  const handleSelectAnswer = (optionIdx: number) => {
    const updated = [...answers];
    updated[currentIndex] = optionIdx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    // Check if any unanswered
    const unansweredCount = answers.filter(a => a === null).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Masih ada ${unansweredCount} soal yang belum kamu jawab. Apakah kamu yakin ingin mengumpulkan kuis sekarang?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score
    let calculatedCorrect = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        calculatedCorrect++;
      }
    });

    const calculatedScore = Math.round((calculatedCorrect / questions.length) * 100);
    setCorrectCount(calculatedCorrect);
    setScore(calculatedScore);

    // Save to history in localStorage
    try {
      const newHistoryItem: QuizHistoryItem = {
        id: Date.now().toString(),
        name: studentName.trim(),
        score: calculatedScore,
        correctCount: calculatedCorrect,
        totalQuestions: questions.length,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('geo_quiz_history', JSON.stringify(updatedHistory));
    } catch {}

    setStage('result');
  };

  const currentQ = questions[currentIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercent = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="quiz-view-wrap">
      <div className="quiz-top-bar">
        <Link href="/" aria-label="Kembali ke Beranda" className="quiz-home-icon-btn" title="Kembali ke Beranda">
          <House className="w-6 h-6" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 1. LAYAR START (INPUT NAMA MURID) */}
      {/* ============================================================ */}
      {stage === 'start' && (
        <section className="quiz-glass-card quiz-start-card" aria-label="Mulai Uji Pemahaman">
          <div className="quiz-start-header">
            <div className="quiz-badge-kicker">IPAS KELAS 6 • EVALUASI PEMBELAJARAN</div>
            <h1>Uji Pemahaman Nusantara</h1>
            <p className="quiz-start-desc">
              Uji kemampuanmu tentang <strong>Letak Khatulistiwa</strong>, <strong>Jalur Cincin Api</strong>, <strong>Negeri Kepulauan</strong>, dan <strong>Mitigasi Gempa Bumi</strong>.
            </p>
          </div>

          <div className="quiz-features-pills">
            <div className="feat-pill">
              <span className="feat-icon">🎲</span>
              <div>
                <strong>10 Soal Acak</strong>
                <small>Dari 50 bank soal kurikulum</small>
              </div>
            </div>
            <div className="feat-pill">
              <span className="feat-icon">📝</span>
              <div>
                <strong>PG & Benar-Salah</strong>
                <small>Disertai soal gambar</small>
              </div>
            </div>
            <div className="feat-pill">
              <span className="feat-icon">💾</span>
              <div>
                <strong>Tersimpan Lokal</strong>
                <small>Nilai aman di perangkat ini</small>
              </div>
            </div>
          </div>

          <form onSubmit={handleStartQuiz} className="quiz-name-form">
            <label htmlFor="student-name-input" className="quiz-name-label">
              <User className="w-4 h-4 text-amber-300" />
              <span>Ketikkan Nama Kamu:</span>
            </label>
            <div className="quiz-input-row">
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Contoh: Budi Santoso"
                maxLength={40}
                className="quiz-name-input"
                autoFocus
              />
              <button type="submit" className="quiz-submit-btn">
                <span>Mulai Kuis</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            {nameError && (
              <p className="quiz-error-msg" role="alert">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {nameError}
              </p>
            )}
          </form>

          {history.length > 0 && (
            <div className="quiz-history-preview">
              <h4>
                <Trophy className="w-4 h-4 text-yellow-400 inline mr-1" />
                Riwayat Nilai Terakhir di Perangkat Ini:
              </h4>
              <div className="quiz-history-list">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="quiz-history-item">
                    <span className="hist-name">{item.name}</span>
                    <span className="hist-score">{item.score} Poin ({item.correctCount}/{item.totalQuestions})</span>
                    <span className="hist-date">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. LAYAR KUIS INTERAKTIF */}
      {/* ============================================================ */}
      {stage === 'quiz' && currentQ && (
        <section className="quiz-glass-card quiz-active-card" aria-label={`Soal nomor ${currentIndex + 1}`}>
          {/* Header Soal */}
          <div className="quiz-question-header">
            <div className="quiz-header-meta">
              <span className="quiz-category-tag">{currentQ.categoryLabel}</span>
              <span className="quiz-type-tag">
                {currentQ.type === 'multiple-choice' ? 'Pilihan Ganda' : 'Benar / Salah'}
              </span>
            </div>
            <div className="quiz-counter-badge">
              Soal <strong>{currentIndex + 1}</strong> dari <strong>{questions.length}</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Gambar Soal (Jika Ada) */}
          {currentQ.image && (
            <div className="quiz-image-container">
              <img 
                src={currentQ.image} 
                alt={`Ilustrasi Soal ${currentIndex + 1}`} 
                className="quiz-question-img" 
              />
            </div>
          )}

          {/* Teks Pertanyaan */}
          <h2 className="quiz-question-text">{currentQ.question}</h2>

          {/* Opsi Jawaban */}
          {currentQ.type === 'multiple-choice' ? (
            <div className="quiz-options-grid">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectAnswer(idx)}
                  >
                    <div className="option-letter">{letter}</div>
                    <div className="option-text">{option}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="quiz-tf-grid">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                const isTrue = idx === 0;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`quiz-tf-btn ${isTrue ? 'tf-true' : 'tf-false'} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectAnswer(idx)}
                  >
                    <span className="tf-icon">{isTrue ? '✓' : '✗'}</span>
                    <span className="tf-label">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Nav Track Numbers */}
          <div className="quiz-nav-dots" aria-label="Lompat ke nomor soal">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== null;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`quiz-dot-btn ${isCurrent ? 'is-current' : ''} ${isAnswered ? 'is-answered' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Buka soal nomor ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="quiz-bottom-actions">
            <button
              type="button"
              className="quiz-prev-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Sebelumnya</span>
            </button>

            <span className="quiz-status-indicator">
              Terjawab: {answeredCount} dari {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                className="quiz-next-btn"
                onClick={handleNext}
              >
                <span>Berikutnya</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                className="quiz-finish-btn"
                onClick={handleFinishQuiz}
              >
                <CheckCircle2 className="w-5 h-5 mr-1" />
                <span>Kumpulkan & Lihat Nilai</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. LAYAR HASIL & SKOR AKHIR */}
      {/* ============================================================ */}
      {stage === 'result' && (
        <section className="quiz-glass-card quiz-result-card" aria-label="Hasil Uji Pemahaman">
          <div className="result-header">
            <div className="result-trophy-ring">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <div className="quiz-badge-kicker">HASIL UJI PEMAHAMAN</div>
            <h2>Selamat, {studentName}!</h2>
            <p className="result-subtitle">Kamu telah menyelesaikan 10 soal uji pemahaman IPAS Geografi & Mitigasi Gempa.</p>
          </div>

          {/* Kartu Skor Besar */}
          <div className="result-score-banner">
            <div className="result-score-num">{score}</div>
            <div className="result-score-label">NILAI AKHIR (DARI 100)</div>
          </div>

          {/* Predikat & Pesan Motivasi */}
          <div className="result-predicate-box">
            {score >= 90 ? (
              <p className="predicate-great">
                🌟 <strong>Luar Biasa Hebat!</strong> Kamu sangat memahami kondisi alam nusantara dan langkah mitigasi bencana dengan sempurna!
              </p>
            ) : score >= 70 ? (
              <p className="predicate-good">
                👍 <strong>Bagus Sekali!</strong> Pemahamanmu sudah sangat baik dan siap menjadi generasi tangguh bencana!
              </p>
            ) : (
              <p className="predicate-practice">
                💪 <strong>Tetap Semangat!</strong> Terus pelajari materi geografi dan mitigasi untuk melatih kesiapsiagaanmu, lalu coba lagi!
              </p>
            )}
          </div>

          {/* Statistik Rincian */}
          <div className="result-stats-row">
            <div className="stat-card stat-correct">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <strong>{correctCount} Soal</strong>
                <span>Jawaban Benar</span>
              </div>
            </div>
            <div className="stat-card stat-incorrect">
              <XCircle className="w-6 h-6 text-rose-400" />
              <div>
                <strong>{questions.length - correctCount} Soal</strong>
                <span>Jawaban Kurang Tepat</span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Hasil */}
          <div className="result-actions-grid">
            <button
              type="button"
              className="result-btn-review"
              onClick={() => setStage('review')}
            >
              <BookOpen className="w-5 h-5 mr-1" />
              <span>Tinjau Pembahasan Soal</span>
            </button>

            <button
              type="button"
              className="result-btn-retry"
              onClick={() => handleStartQuiz()}
            >
              <RotateCcw className="w-5 h-5 mr-1" />
              <span>Coba Lagi (10 Soal Acak Baru)</span>
            </button>

            <Link href="/" className="result-btn-home">
              <House className="w-5 h-5 mr-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. LAYAR PEMBAHASAN SOAL LENGKAP */}
      {/* ============================================================ */}
      {stage === 'review' && (
        <section className="quiz-glass-card quiz-review-card" aria-label="Tinjauan Pembahasan Soal">
          <div className="review-top-bar">
            <div>
              <h2>Pembahasan Soal Kuis</h2>
              <p>Murid: <strong>{studentName}</strong> • Nilai: <strong>{score}</strong> ({correctCount} dari {questions.length} benar)</p>
            </div>
            <button
              type="button"
              className="review-back-btn"
              onClick={() => setStage('result')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Kembali ke Nilai</span>
            </button>
          </div>

          <div className="review-questions-list">
            {questions.map((q, idx) => {
              const studentAnswer = answers[idx];
              const isCorrect = studentAnswer === q.correctAnswer;
              return (
                <article
                  key={q.id}
                  className={`review-item-card ${isCorrect ? 'review-correct' : 'review-incorrect'}`}
                >
                  <div className="review-item-header">
                    <span className="review-num">Nomor {idx + 1}</span>
                    <span className="review-cat">{q.categoryLabel}</span>
                    <span className={`review-badge ${isCorrect ? 'badge-pass' : 'badge-fail'}`}>
                      {isCorrect ? '✓ Benar (+10)' : '✗ Kurang Tepat'}
                    </span>
                  </div>

                  {q.image && (
                    <div className="review-img-wrap">
                      <img src={q.image} alt="" className="review-thumb-img" />
                    </div>
                  )}

                  <h3 className="review-q-text">{q.question}</h3>

                  <div className="review-answers-box">
                    <div className="ans-row">
                      <span className="ans-label">Jawaban Kamu:</span>
                      <strong className={`ans-val ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {studentAnswer !== null ? q.options[studentAnswer] : 'Tidak dijawab'}
                      </strong>
                    </div>

                    {!isCorrect && (
                      <div className="ans-row">
                        <span className="ans-label">Kunci Jawaban Benar:</span>
                        <strong className="ans-val text-amber-300">
                          {q.options[q.correctAnswer]}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="review-explanation">
                    <strong>💡 Pembahasan:</strong> {q.explanation}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="review-footer-bar">
            <button
              type="button"
              className="result-btn-retry"
              onClick={() => handleStartQuiz()}
            >
              <RotateCcw className="w-5 h-5 mr-1" />
              <span>Coba Lagi (10 Soal Acak Baru)</span>
            </button>
            <Link href="/" className="result-btn-home">
              <House className="w-5 h-5 mr-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
