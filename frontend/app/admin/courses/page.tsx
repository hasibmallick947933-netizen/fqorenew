'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
  X,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';

interface CoursePricingTier {
  price: number;
  features: string[];
}

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  moduleNum: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  deliverables: string[];
  pricing: {
    starter: CoursePricingTier;
    growth: CoursePricingTier;
    premium: CoursePricingTier;
  };
  active?: boolean;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    moduleNum: 'Core Module 01',
    description: '',
    category: 'Business Models',
    level: 'Executive',
    duration: '6.0 Hours Masterclass',
    deliverables: '',
    starterPrice: 59,
    growthPrice: 99,
    premiumPrice: 149,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; courses: CourseItem[] }>('/courses/admin/all');
      setCourses(res.courses || []);
    } catch (err: any) {
      setErrorMsg('Failed to load courses from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormState({
      title: '',
      moduleNum: `Core Module 0${courses.length + 1}`,
      description: '',
      category: 'Business Models',
      level: 'Executive',
      duration: '6.0 Hours Masterclass',
      deliverables:
        '100-page Executive Dossier PDF\nDynamic Financial Model (.xlsx)\nVideo Masterclass',
      starterPrice: 59,
      growthPrice: 99,
      premiumPrice: 149,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: CourseItem) => {
    setEditingCourse(c);
    setFormState({
      title: c.title,
      moduleNum: c.moduleNum || 'Core Module',
      description: c.description,
      category: c.category || 'Business Models',
      level: c.level || 'Executive',
      duration: c.duration || '6.0 Hours Masterclass',
      deliverables: c.deliverables ? c.deliverables.join('\n') : '',
      starterPrice: c.pricing?.starter?.price || 59,
      growthPrice: c.pricing?.growth?.price || 99,
      premiumPrice: c.pricing?.premium?.price || 149,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      title: formState.title,
      moduleNum: formState.moduleNum,
      description: formState.description,
      category: formState.category,
      level: formState.level,
      duration: formState.duration,
      deliverables: formState.deliverables
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
      pricing: {
        starter: {
          price: Number(formState.starterPrice),
          features: ['Core Dossier PDF', 'Web Reader Access'],
        },
        growth: {
          price: Number(formState.growthPrice),
          features: ['Complete Dossier + Excel Models', 'Case Study Autopsies'],
        },
        premium: {
          price: Number(formState.premiumPrice),
          features: ['All-Access Pass', 'Video Masterclass', 'Direct Q&A'],
        },
      },
    };

    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, payload);
        setSuccessMsg('Course & Pricing updated successfully!');
      } else {
        await api.post('/courses', payload);
        setSuccessMsg('New Course created successfully with 3-tier pricing!');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save course changes.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/courses/${id}`);
      setSuccessMsg('Course deleted successfully.');
      fetchCourses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete course.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-lowest/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum Administration
          </div>
          <h1 className="font-headline-lg text-headline-lg text-surface-container-lowest tracking-tight">
            Institutional Courses &amp; Tier Pricing Manager
          </h1>
          <p className="font-body-sm text-body-sm text-on-primary-container">
            Add new educational courses, configure syllabus deliverables, and manage 3-tier prices (Starter, Growth, Premium) dynamically.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-300">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 rounded-3xl bg-primary-container/40 border border-surface-container-lowest/10 animate-pulse"
            />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-7 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-[#0d1c32] text-secondary-container">
                    {course.moduleNum || 'Core Module'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-slate-950 mb-2 leading-snug">
                  {course.title}
                </h3>
                <p className="font-body-sm text-body-sm text-slate-600 line-clamp-2 mb-4">
                  {course.description}
                </p>

                {/* 3-Tier Pricing Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-2">
                    Current 3-Tier Prices:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="text-[9px] text-slate-500 font-bold">STARTER</div>
                      <div className="text-sm font-bold text-slate-900">
                        ₹{course.pricing?.starter?.price || 59}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-300">
                      <div className="text-[9px] text-amber-800 font-bold">GROWTH</div>
                      <div className="text-sm font-bold text-amber-900">
                        ₹{course.pricing?.growth?.price || 99}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 text-white">
                      <div className="text-[9px] text-amber-300 font-bold">PREMIUM</div>
                      <div className="text-sm font-bold text-white">
                        ₹{course.pricing?.premium?.price || 149}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500">
                  Deliverables: {course.deliverables?.length || 0} items
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="px-3.5 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit &amp; Prices
                  </button>
                  <button
                    onClick={() => handleDelete(course._id, course.title)}
                    className="p-2 rounded-xl text-xs text-red-500 hover:bg-red-50 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-primary-container/40 border border-surface-container-lowest/15">
          <BookOpen className="w-12 h-12 text-on-primary-container mx-auto mb-3" />
          <p className="font-headline-sm text-headline-sm text-surface-container-lowest">
            No courses found in database.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-5 py-2.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold"
          >
            Create First Course
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-primary-container border border-surface-container-lowest/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl space-y-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-surface-container-lowest/10 pb-4">
              <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
                {editingCourse ? 'Edit Course & 3-Tier Prices' : 'Add New Course'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-on-primary-container hover:text-surface-container-lowest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Algorithmic Microstructure & Order Flow"
                  className="w-full px-4 py-2.5 bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-white text-sm focus:outline-none focus:border-secondary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                    Module Number
                  </label>
                  <input
                    type="text"
                    value={formState.moduleNum}
                    onChange={(e) => setFormState({ ...formState, moduleNum: e.target.value })}
                    placeholder="Core Module 07"
                    className="w-full px-4 py-2.5 bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-white text-sm focus:outline-none focus:border-secondary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-white text-sm focus:outline-none focus:border-secondary-container cursor-pointer"
                  >
                    <option value="Business Models">Business Models</option>
                    <option value="Stock Market">Stock Market</option>
                    <option value="Companies">Companies</option>
                    <option value="Investing & DCF">Investing &amp; DCF</option>
                    <option value="Trading Systems">Trading Systems</option>
                    <option value="Case Studies">Case Studies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                  Course Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Detailed breakdown of the course objectives..."
                  className="w-full px-4 py-2.5 bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-white text-sm focus:outline-none focus:border-secondary-container"
                />
              </div>

              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                  Deliverables (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formState.deliverables}
                  onChange={(e) => setFormState({ ...formState, deliverables: e.target.value })}
                  placeholder="100-page Executive Dossier PDF&#10;Dynamic Excel Calculator&#10;Video Lecture"
                  className="w-full px-4 py-2.5 bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-secondary-container"
                />
              </div>

              {/* 3-Tier Price Editors */}
              <div className="p-4 rounded-2xl bg-tertiary-container border border-surface-container-lowest/15 space-y-3">
                <span className="text-xs font-label-sm uppercase tracking-widest text-secondary-container font-bold block">
                  Configure 3-Tier Pricing (INR):
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-on-primary-container mb-1">
                      Starter (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formState.starterPrice}
                      onChange={(e) =>
                        setFormState({ ...formState, starterPrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-primary-container border border-surface-container-lowest/20 rounded-xl text-white font-mono text-sm font-bold focus:border-secondary-container"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-secondary-container mb-1">
                      Growth (₹) ★
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formState.growthPrice}
                      onChange={(e) =>
                        setFormState({ ...formState, growthPrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-primary-container border border-amber-400/50 rounded-xl text-secondary-container font-mono text-sm font-bold focus:border-secondary-container"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-on-primary-container mb-1">
                      Premium (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formState.premiumPrice}
                      onChange={(e) =>
                        setFormState({ ...formState, premiumPrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-primary-container border border-surface-container-lowest/20 rounded-xl text-white font-mono text-sm font-bold focus:border-secondary-container"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-container-lowest/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-label-md uppercase tracking-wider text-on-primary-container hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-lg cursor-pointer"
                >
                  {editingCourse ? 'Save Changes & Prices' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
