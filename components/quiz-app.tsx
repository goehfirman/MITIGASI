"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  QuizQuestion, 
  getRandomQuizQuestions 
} from '@/lib/quiz-data';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  House, 
  User, 
  Trophy, 
  BookOpen, 
  AlertCircle,
  Shuffle,
  Sparkles
} from 'lucide-react';
import QuizMap from './quiz-map';

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
  const [answers, setAnswers] = useState<(number | string | null)[]>([]);
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

  const handleSelectAnswer = (answer: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
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
    <section className="learning-deck quiz-deck quiz-theme" aria-label="Uji Pemahaman Siswa">
      {/* Row 1: Header Top Bar */}
      <div className="slide-top">
        <Link href="/" aria-label="Kembali ke Beranda" title="Kembali ke Beranda">
          <House />
        </Link>
      </div>

      {/* Row 2: Standard Page Title */}
      <h1>Uji Pemahaman</h1>

      {/* ============================================================ */}
      {/* 1. LAYAR START (INPUT NAMA MURID) */}
      {/* ============================================================ */}
      {stage === 'start' && (
        <div key="start" className="quiz-deck-body quiz-stage-centered section-fade-in">
          <article className="slide-glass quiz-glass-card quiz-start-card" aria-label="Mulai Uji Pemahaman">
            <div className="quiz-card-head">
              <div className="geo-kicker">
                <span /> SIMULASI UJI KEMAMPUAN
              </div>
              <h2>Kenali Negeri Kita, Siap Siaga Bencana</h2>
              <p className="quiz-start-desc">
                Uji pemahamanmu tentang <strong>Letak Khatulistiwa</strong>, <strong>Jalur Cincin Api</strong>, <strong>Negeri Kepulauan</strong>, serta <strong>Mitigasi Gempa Bumi</strong>.
              </p>
            </div>

            <div className="quiz-features-grid">
              <div className="feat-card">
                <div className="feat-icon-box">
                  <Shuffle className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <strong>10 Soal Acak</strong>
                  <small>Dipilih otomatis dari 50 bank soal kurikulum</small>
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon-box">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <strong>PG & Benar-Salah</strong>
                  <small>Dilengkapi variasi soal ilustrasi gambar</small>
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon-box">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <strong>Nilai Tersimpan Lokal</strong>
                  <small>Skor dan riwayat aman di browser ini</small>
                </div>
              </div>
            </div>

            <form onSubmit={handleStartQuiz} className="quiz-name-form">
              <label htmlFor="student-name-input" className="quiz-name-label">
                <User className="w-4 h-4 text-sky-400" />
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
                <button type="submit" className="quiz-start-btn">
                  <span>Mulai Uji Pemahaman</span>
                  <ArrowRight className="w-5 h-5" />
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
                  <Trophy className="w-4 h-4 text-amber-300 inline mr-1.5" />
                  Riwayat Nilai Sebelumnya di Perangkat Ini:
                </h4>
                <div className="quiz-history-list">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="quiz-history-item">
                      <span className="hist-name">{item.name}</span>
                      <span className="hist-score">{item.score} Poin ({item.correctCount}/{item.totalQuestions} Benar)</span>
                      <span className="hist-date">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. LAYAR KUIS INTERAKTIF */}
      {/* ============================================================ */}
      {stage === 'quiz' && currentQ && (
        <div key={`quiz-${currentIndex}`} className="quiz-deck-body quiz-stage-active section-fade-in">
          <article className="slide-glass quiz-glass-card quiz-active-card" aria-label={`Soal nomor ${currentIndex + 1}`}>
            {currentQ.type === 'map-click' ? (
              <div className="quiz-active-grid-map">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
                  <div className="quiz-question-header">
                    <div className="quiz-header-meta">
                      <span className="quiz-category-tag">{currentQ.categoryLabel}</span>
                    </div>
                    <div className="quiz-counter-badge">
                      Soal <strong>{currentIndex + 1}</strong> dari <strong>{questions.length}</strong>
                    </div>
                  </div>
                  <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {currentQ.image && (
                      <img 
                        src={currentQ.image} 
                        alt="Ilustrasi Soal" 
                        style={{ height: '80px', width: '120px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    )}
                    <h2 className="quiz-question-text" style={{ fontSize: '18px', margin: 0 }}>{currentQ.question}</h2>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                  <QuizMap 
                    type={currentQ.mapType || 'island'} 
                    onLocationSelected={(name) => handleSelectAnswer(name)} 
                  />
                </div>
              </div>
            ) : (
              <div className="quiz-active-grid">
                <div className="quiz-q-left">
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

                  <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>

                  {currentQ.image && (
                    <div className="quiz-image-container">
                      <img 
                        src={currentQ.image} 
                        alt={`Ilustrasi Soal ${currentIndex + 1}`} 
                        className="quiz-question-img" 
                      />
                    </div>
                  )}

                  <h2 className="quiz-question-text">{currentQ.question}</h2>
                </div>

                <div className="quiz-q-right">
                  {currentQ.type === 'multiple-choice' ? (
                    <div className="quiz-options-grid">
                      {currentQ.options.map((option, idx) => {
                        const isSelected = answers[currentIndex] === idx;
                        const letter = String.fromCharCode(65 + idx);
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
                </div>
              </div>
            )}
          </article>

          {/* Row 4 Navigasi: Identik dengan .slide-navigation pada Belajar & Mitigasi */}
          <div className="slide-navigation quiz-navigation">
            <button
              type="button"
              className="quiz-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Sebelumnya</span>
            </button>

            <div className="slide-selectors quiz-selectors" aria-label="Lompat ke nomor soal">
              {questions.map((_, idx) => {
                const isAnswered = answers[idx] !== null;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-current={isCurrent ? 'page' : undefined}
                    className={isAnswered && !isCurrent ? 'is-answered' : undefined}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Buka soal nomor ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                className="quiz-nav-btn"
                onClick={handleNext}
              >
                <span>Berikutnya</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                type="button"
                className="quiz-nav-btn quiz-finish-btn"
                onClick={handleFinishQuiz}
              >
                <span>Kumpulkan & Nilai</span>
                <CheckCircle2 className="w-5 h-5 ml-1.5 text-emerald-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. LAYAR HASIL & SKOR AKHIR */}
      {/* ============================================================ */}
      {stage === 'result' && (
        <div key="result" className="quiz-deck-body quiz-stage-centered section-fade-in">
          <article className="slide-glass quiz-glass-card quiz-result-card" aria-label="Hasil Uji Pemahaman">
            <div className="result-header">
              <div className="result-trophy-ring">
                <Trophy className="w-10 h-10 text-amber-300" />
              </div>
              <div className="geo-kicker">
                <span /> HASIL UJI PEMAHAMAN
              </div>
              <h2>Selamat, {studentName}!</h2>
              <p className="result-subtitle">Kamu telah menyelesaikan 10 butir soal evaluasi kurikulum IPAS Geografi & Mitigasi Gempa.</p>
            </div>

            {/* Kartu Skor Besar */}
            <div className="result-score-banner">
              <div className="result-score-num">{score}</div>
              <div className="result-score-label">NILAI AKHIR (SKALA 100)</div>
            </div>

            {/* Predikat & Pesan Motivasi */}
            <div className="result-predicate-box">
              {score >= 90 ? (
                <p className="predicate-great">
                  🌟 <strong>Luar Biasa Hebat!</strong> Pemahamanmu tentang kondisi geografi nusantara dan langkah mitigasi bencana sudah sangat matang!
                </p>
              ) : score >= 70 ? (
                <p className="predicate-good">
                  👍 <strong>Bagus Sekali!</strong> Pemahamanmu sudah sangat baik dan siap menjadi generasi cerdas tangguh bencana!
                </p>
              ) : (
                <p className="predicate-practice">
                  💪 <strong>Tetap Semangat Belajar!</strong> Pelajari kembali materi letak geografi dan mitigasi untuk melatih kesiapsiagaanmu, lalu coba lagi!
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
                <BookOpen className="w-5 h-5 mr-1.5" />
                <span>Tinjau Pembahasan Soal</span>
              </button>

              <button
                type="button"
                className="result-btn-retry"
                onClick={() => handleStartQuiz()}
              >
                <RotateCcw className="w-5 h-5 mr-1.5" />
                <span>Ulangi Kuis (10 Soal Acak Baru)</span>
              </button>

              <Link href="/" className="result-btn-home">
                <House className="w-5 h-5 mr-1.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </article>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. LAYAR PEMBAHASAN SOAL LENGKAP */}
      {/* ============================================================ */}
      {stage === 'review' && (
        <div key="review" className="quiz-deck-body quiz-stage-review section-fade-in">
          <article className="slide-glass quiz-glass-card quiz-review-card" aria-label="Tinjauan Pembahasan Soal">
            <div className="review-top-bar">
              <div>
                <h2>Pembahasan Soal Uji Pemahaman</h2>
                <p>Murid: <strong>{studentName}</strong> • Nilai: <strong>{score}</strong> ({correctCount} dari {questions.length} benar)</p>
              </div>
              <button
                type="button"
                className="review-back-btn"
                onClick={() => setStage('result')}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Kembali ke Skor</span>
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
                        {isCorrect ? '✓ Jawaban Benar (+10)' : '✗ Jawaban Kurang Tepat'}
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
                          {studentAnswer !== null 
                            ? (q.type === 'map-click' ? studentAnswer : q.options[studentAnswer as number]) 
                            : 'Tidak dijawab'}
                        </strong>
                      </div>

                      {!isCorrect && (
                        <div className="ans-row">
                          <span className="ans-label">Kunci Jawaban yang Benar:</span>
                          <strong className="ans-val text-amber-300">
                            {q.type === 'map-click' ? q.correctAnswer : q.options[q.correctAnswer as number]}
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
                <RotateCcw className="w-5 h-5 mr-1.5" />
                <span>Coba Lagi (10 Soal Acak Baru)</span>
              </button>
              <Link href="/" className="result-btn-home">
                <House className="w-5 h-5 mr-1.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
