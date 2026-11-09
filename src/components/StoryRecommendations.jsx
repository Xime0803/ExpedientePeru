import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, ThumbsUp, MessageSquare, Video, Smartphone, 
  MapPin, CheckCircle2, Filter, AlertCircle, ExternalLink, Globe, 
  UserCheck, Trophy, Flame, Clock, ArrowRight, ShieldAlert,
  Lock, Unlock, ShieldCheck, Edit3, Trash2, Check, X, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import { 
  fetchRecommendationsFromDb, 
  addRecommendationToDb, 
  voteRecommendationInDb, 
  addCommentToRecommendationInDb,
  deleteRecommendationFromDb,
  updateRecommendationInDb,
  subscribeRecommendations 
} from '../services/dbService';
import { 
  verifyAdminCredentials, 
  getAdminSecurityStatus, 
  sanitizeSecureText 
} from '../security/securityVault';

export default function StoryRecommendations({ userProfile, onOpenRegister, onNavigateTab }) {
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem('expediente_recommendations_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [platformFilter, setPlatformFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('top'); // 'top' | 'recientes'
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [platform, setPlatform] = useState('ambas');
  const [storyDetails, setStoryDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // ESTADO DE SEGURIDAD ADMINISTRATIVA (Clave Maestra 924571958)
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('exp_admin_active_session') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'edit' | 'delete', rec }

  // ESTADOS DE EDICIÓN Y ELIMINACIÓN
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRec, setEditingRec] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPlace, setEditPlace] = useState("");
  const [editPlatform, setEditPlatform] = useState("ambas");
  const [editStoryDetails, setEditStoryDetails] = useState("");
  const [editVotes, setEditVotes] = useState(1);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRec, setDeletingRec] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Temporizador anti-fuerza bruta
  useEffect(() => {
    if (isAdminModalOpen) {
      const status = getAdminSecurityStatus();
      if (status.isLocked) {
        setLockoutRemaining(status.remainingSeconds);
      }
    }
  }, [isAdminModalOpen]);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          setAdminError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Sincronizar recomendaciones con Supabase en tiempo real
  useEffect(() => {
    fetchRecommendationsFromDb().then(data => {
      if (data) {
        setRecommendations(data);
      }
    });

    const unsub = subscribeRecommendations((data) => {
      if (data) {
        setRecommendations(data);
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('expediente_recommendations_v3', JSON.stringify(recommendations));
  }, [recommendations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !storyDetails.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    const newRec = {
      id: "rec-" + Date.now(),
      title: title.trim(),
      place: place.trim() || "Perú",
      platform,
      author: userProfile.nickname,
      country: userProfile.country || "Perú",
      flag: userProfile.flag || "🇵🇪",
      storyDetails: storyDetails.trim(),
      votes: 1,
      createdAt: Date.now(),
      timestamp: "Hace un momento",
      comments: []
    };

    setRecommendations([newRec, ...recommendations]);
    setTitle('');
    setPlace('');
    setStoryDetails('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);

    // Guardar en la base de datos de Supabase
    addRecommendationToDb(newRec);
  };

  const handleVote = (id) => {
    let updatedVotes = 1;
    setRecommendations(prev => prev.map(item => {
      if (item.id === id) {
        updatedVotes = (item.votes || 0) + 1;
        return { ...item, votes: updatedVotes };
      }
      return item;
    }));

    // Persistir voto en Supabase
    voteRecommendationInDb(id, updatedVotes);
  };

  const handleAddComment = (recId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    let finalComments = [];
    setRecommendations(prev => prev.map(item => {
      if (item.id === recId) {
        finalComments = [
          ...(item.comments || []),
          {
            id: "c-" + Date.now(),
            user: userProfile.nickname,
            country: userProfile.country || "Perú",
            flag: userProfile.flag || "🇵🇪",
            text: commentText.trim(),
            time: "Hace un momento"
          }
        ];
        return {
          ...item,
          comments: finalComments
        };
      }
      return item;
    }));

    // Guardar comentarios en Supabase
    addCommentToRecommendationInDb(recId, finalComments);

    setCommentText('');
  };

  // CONTROL DE ACCESO ADMINISTRATIVO
  const handleTriggerEdit = (rec) => {
    if (!isAdmin) {
      setPendingAction({ type: 'edit', rec });
      setAdminError("");
      setAdminPin("");
      setIsAdminModalOpen(true);
      return;
    }
    openEditModal(rec);
  };

  const openEditModal = (rec) => {
    setEditingRec(rec);
    setEditTitle(rec.title);
    setEditPlace(rec.place);
    setEditPlatform(rec.platform || "ambas");
    setEditStoryDetails(rec.storyDetails);
    setEditVotes(rec.votes || 1);
    setIsEditModalOpen(true);
  };

  const handleTriggerDelete = (rec) => {
    if (!isAdmin) {
      setPendingAction({ type: 'delete', rec });
      setAdminError("");
      setAdminPin("");
      setIsAdminModalOpen(true);
      return;
    }
    setDeletingRec(rec);
    setIsDeleteModalOpen(true);
  };

  const handleAdminVerify = async (e) => {
    e.preventDefault();
    if (!adminPin || isVerifyingAdmin) return;
    setIsVerifyingAdmin(true);
    setAdminError("");

    try {
      const result = await verifyAdminCredentials(adminPin);
      if (result.success) {
        setIsAdmin(true);
        sessionStorage.setItem('exp_admin_active_session', 'true');
        setIsAdminModalOpen(false);
        setAdminPin("");
        showToast("Acceso de Administrador Autorizado (Bóveda SHA-256)");

        if (pendingAction) {
          if (pendingAction.type === 'edit') {
            openEditModal(pendingAction.rec);
          } else if (pendingAction.type === 'delete') {
            setDeletingRec(pendingAction.rec);
            setIsDeleteModalOpen(true);
          }
          setPendingAction(null);
        }
      } else {
        if (result.isLocked) {
          setLockoutRemaining(result.remainingSeconds);
        }
        setAdminError(result.message || "Clave de administrador incorrecta.");
      }
    } catch (err) {
      setAdminError("Error al verificar credenciales.");
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('exp_admin_active_session');
    showToast("Sesión de Administrador cerrada");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRec) return;
    setIsSavingEdit(true);

    const cleanTitle = sanitizeSecureText(editTitle);
    const cleanPlace = sanitizeSecureText(editPlace);
    const cleanDetails = sanitizeSecureText(editStoryDetails);
    const numVotes = Math.max(0, parseInt(editVotes, 10) || 1);

    const updatedList = recommendations.map(r => {
      if (r.id === editingRec.id) {
        return {
          ...r,
          title: cleanTitle,
          place: cleanPlace,
          platform: editPlatform,
          storyDetails: cleanDetails,
          votes: numVotes
        };
      }
      return r;
    });

    setRecommendations(updatedList);
    localStorage.setItem('expediente_recommendations_v3', JSON.stringify(updatedList));

    await updateRecommendationInDb(editingRec.id, {
      title: cleanTitle,
      place: cleanPlace,
      platform: editPlatform,
      storyDetails: cleanDetails,
      votes: numVotes
    });

    setIsSavingEdit(false);
    setIsEditModalOpen(false);
    setEditingRec(null);
    showToast("Historia actualizada y sincronizada en la nube");
  };

  const handleConfirmDelete = async () => {
    if (!deletingRec) return;
    setIsDeleting(true);

    const filteredList = recommendations.filter(r => r.id !== deletingRec.id);
    setRecommendations(filteredList);
    localStorage.setItem('expediente_recommendations_v3', JSON.stringify(filteredList));

    await deleteRecommendationFromDb(deletingRec.id);

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setDeletingRec(null);
    showToast("Historia eliminada definitivamente de la base de datos");
  };

  // Filter recommendations
  const filtered = recommendations.filter(r => {
    if (platformFilter === 'todas') return true;
    return r.platform === platformFilter || r.platform === 'ambas';
  });

  // Sort recommendations: Top voted or Most recent
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'top') {
      return b.votes - a.votes;
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // Top 3 Ranking
  const topRanked = [...recommendations]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)
    .filter(item => item.votes > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border-2 border-amber-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in font-mono text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* BANNER DE ADMINISTRADOR ACTIVO */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-950/70 via-[#131b2e] to-amber-950/70 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/70 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white">SESIÓN DE ADMINISTRADOR ACTIVA</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">
                  Bóveda SHA-256 Verificada
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                Tienes permisos exclusivos para <strong>editar</strong> o <strong>eliminar</strong> permanentemente cualquier historia de la comunidad.
              </p>
            </div>
          </div>
          <button
            onClick={handleAdminLogout}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700 hover:border-amber-500 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all self-end sm:self-auto shrink-0 shadow-md"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Cerrar Sesión Admin</span>
          </button>
        </div>
      )}

      {/* Intro Header */}
      <div className="bg-[#121826] border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-700/60 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>PROPUESTAS DE LA COMUNIDAD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recomendar Nuevas Historias para el Canal
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              ¿Conoces un caso real, suceso extraño o leyenda de tu pueblo o provincia en el Perú? 
              Indícanos si te gustaría verlo como un <strong>video largo en YouTube</strong> o en un <strong>clip rápido en TikTok</strong>. Las historias con más votos serán grabadas primero.
            </p>
          </div>

          {/* Actions & Channels */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            {!isAdmin && (
              <button
                onClick={() => {
                  setAdminError("");
                  setAdminPin("");
                  setIsAdminModalOpen(true);
                }}
                className="bg-slate-900/90 hover:bg-amber-950/60 text-slate-200 hover:text-amber-300 border-2 border-slate-700 hover:border-amber-500/80 font-mono font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
                title="Acceso protegido con clave maestra para edición y eliminación"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Gestión Admin</span>
              </button>
            )}

            <a 
              href="https://www.youtube.com/@XimeFer8322" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-red-950"
            >
              <Video className="w-4 h-4" />
              <span>YouTube @XimeFer8322</span>
            </a>
            <a 
              href="https://www.tiktok.com/@epicclips_83" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-700"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>TikTok @epicclips_83</span>
            </a>
          </div>
        </div>
      </div>

      {/* TOP VOTED RANKING PODIUM */}
      {topRanked.length > 0 && (
        <div className="bg-gradient-to-r from-[#171e2e] via-[#121927] to-[#171e2e] border-2 border-amber-500/50 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-500/30 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center">
                  <span>TOP DE HISTORIAS MÁS VOTADAS</span>
                  <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                    En Carrera para Grabación
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Casos liderando las preferencias de los seguidores para los próximos videos.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-amber-400 font-bold self-start sm:self-auto">
              {topRanked.length} en el Podio
            </span>
          </div>

          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {topRanked.map((item, index) => {
              const medal = index === 0 ? "🥇 1º PUESTO" : index === 1 ? "🥈 2º PUESTO" : "🥉 3º PUESTO";
              const medalColor = index === 0 
                ? "border-amber-500 bg-amber-950/40 text-amber-300" 
                : index === 1 
                ? "border-slate-400 bg-slate-900/60 text-slate-200" 
                : "border-amber-700 bg-amber-950/20 text-amber-400";

              return (
                <div 
                  key={item.id}
                  className="bg-[#0b0e17] border-2 border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-2 hover:border-amber-500/80 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className={`px-2 py-0.5 rounded font-bold border ${medalColor}`}>
                        {medal}
                      </span>
                      <span className="text-amber-400 font-bold font-mono">
                        {item.votes} votos
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {item.storyDetails}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-amber-400" />
                      {item.place}
                    </span>
                    <button
                      onClick={() => handleVote(item.id)}
                      className="text-amber-300 hover:text-white font-bold flex items-center space-x-1"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Votar +1</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestion Form */}
      <div className="bg-[#0f1422] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
            Envía tu recomendación de historia
          </h3>

          <button 
            type="button"
            onClick={onOpenRegister}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>{userProfile?.flag || '🇵🇪'}</span>
            <span>{userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Registrar mi Seudónimo'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          Completa este formulario simple. Nuestro equipo revisará los datos para investigarlos y mencionarte en el video.
        </p>

        {submitted ? (
          <div className="p-5 bg-emerald-950/60 border-2 border-emerald-500/80 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">¡Muchas gracias por tu recomendación!</h4>
            <p className="text-xs sm:text-sm text-slate-200">
              Tu historia ha sido registrada con éxito. Aparecerá en la lista de abajo para que los demás seguidores voten por ella.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  Nombre o Título de la Historia *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. El misterio del faro de Salaverry o La monja de Chachapoyas"
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  Lugar o Ciudad en Perú *
                </label>
                <input
                  type="text"
                  required
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Ej. Arequipa, Huancayo, Chiclayo..."
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                ¿En qué canal te gustaría ver esta historia? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform('youtube')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'youtube'
                      ? 'bg-red-950 border-red-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Video className="w-4 h-4 text-red-500" />
                  <span>Para YouTube (Caso Largo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('tiktok')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'tiktok'
                      ? 'bg-slate-800 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Para TikTok (Clip Rápido)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('ambas')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'ambas'
                      ? 'bg-amber-950 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Para Ambos Canales</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                Cuéntanos de qué trata y por qué debería ser grabada *
              </label>
              <textarea
                required
                rows={3}
                value={storyDetails}
                onChange={(e) => setStoryDetails(e.target.value)}
                placeholder="Explica qué pasó, si hay testigos, noticias antiguas o anécdotas de tu familia sobre este suceso..."
                className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-red-500 font-sans resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-300">
                Se registrará como: <strong className="text-amber-400">{userProfile?.flag} {userProfile?.nickname || 'Sin Registrar'}</strong> ({userProfile?.country || 'Perú'})
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Publicar mi Recomendación</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List of Community Recommendations */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Historias Recomendadas por los Seguidores ({sorted.length})</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Vota por las historias enviadas por los seguidores. Solo el administrador con código de seguridad puede modificarlas o eliminarlas.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold hidden sm:inline">Ordenar:</span>
            <button
              onClick={() => setSortBy('top')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-colors ${
                sortBy === 'top'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Top Más Votadas</span>
            </button>
            <button
              onClick={() => setSortBy('recientes')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-colors ${
                sortBy === 'recientes'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Más Recientes</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {sorted.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#0e1320] border-2 border-dashed border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Aún no hay historias recomendadas registradas
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Sé el primer detective en proponer un caso o misterio peruano usando el formulario de arriba para que lidere el Top de Votación para YouTube o TikTok.
            </p>
          </div>
        ) : (
          /* Cards */
          <div className="space-y-5">
            {sorted.map((item, index) => {
              const isCommentsOpen = activeCommentId === item.id;
              const comments = item.comments || [];
              const rank = index + 1;

              return (
                <div 
                  key={item.id} 
                  className={`bg-[#101624] border-2 rounded-2xl p-5 sm:p-6 transition-all space-y-3.5 ${
                    sortBy === 'top' && rank === 1
                      ? 'border-amber-500/80 shadow-xl shadow-amber-950/20'
                      : sortBy === 'top' && rank === 2
                      ? 'border-slate-500/80'
                      : sortBy === 'top' && rank === 3
                      ? 'border-amber-700/80'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      {sortBy === 'top' && (
                        <span className={`px-2.5 py-0.5 rounded-md font-extrabold flex items-center space-x-1 border ${
                          rank === 1
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950 border-slate-200'
                            : rank === 3
                            ? 'bg-amber-800 text-amber-100 border-amber-600'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          <span>#{rank}</span>
                          <span className="hidden sm:inline">en Votos</span>
                        </span>
                      )}

                      <span className="flex items-center text-amber-400 bg-amber-950/50 border border-amber-800/80 px-2.5 py-0.5 rounded-md font-bold">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {item.place}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-200 font-bold flex items-center">
                        <span className="mr-1">{item.flag || '🇵🇪'}</span> {item.author} ({item.country || 'Perú'})
                      </span>
                      <span className="text-slate-500">• {item.timestamp}</span>
                    </div>

                    {/* Platform Badge */}
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-md font-bold flex items-center space-x-1.5 border ${
                      item.platform === 'youtube'
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : item.platform === 'tiktok'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      {item.platform === 'youtube' && <Video className="w-3.5 h-3.5" />}
                      {item.platform === 'tiktok' && <Smartphone className="w-3.5 h-3.5" />}
                      {item.platform === 'ambas' && <Sparkles className="w-3.5 h-3.5" />}
                      <span>
                        {item.platform === 'youtube' ? 'Para YouTube' : item.platform === 'tiktok' ? 'Para TikTok' : 'Para YouTube y TikTok'}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {item.title}
                  </h4>

                  {/* Details */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-[#0a0d14] p-4 rounded-xl border border-slate-800/80">
                    {item.storyDetails}
                  </p>

                  {/* Actions Bar (Votes, Comments & Admin Management) */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono border-t border-slate-800/60">
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => handleVote(item.id)}
                        className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border-2 border-amber-500/60 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center space-x-2 transition-all font-bold shadow-md"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{item.votes} Votos</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-colors border ${
                          isCommentsOpen
                            ? 'bg-slate-800 text-white border-slate-600'
                            : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Comentarios ({comments.length})</span>
                      </button>
                    </div>

                    {/* SECCIÓN EXCLUSIVA DE ADMINISTRADOR (EDITAR / ELIMINAR) */}
                    <div className="flex items-center space-x-2">
                      {isAdmin ? (
                        <>
                          <button 
                            onClick={() => handleTriggerEdit(item)}
                            className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/60 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                            title="Editar esta historia en la base de datos"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button 
                            onClick={() => handleTriggerDelete(item)}
                            className="bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-700/60 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                            title="Eliminar esta historia permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleTriggerEdit(item)}
                          className="text-[11px] font-mono text-slate-400 hover:text-amber-400 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
                          title="Solo el administrador con clave de 9 dígitos puede editar o eliminar"
                        >
                          <Lock className="w-3 h-3 text-amber-500/80" />
                          <span>Modificar (Solo Admin)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* INLINE COMMENTS SECTION */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-800 space-y-4 bg-[#0a0d14] p-4 sm:p-5 rounded-2xl">
                      
                      <div className="bg-amber-950/40 border-2 border-amber-500/60 p-4 rounded-xl space-y-2.5">
                        <div className="flex items-start space-x-2.5">
                          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-amber-200">
                              Norma de la Comunidad: Comentarios exclusivos sobre esta historia
                            </p>
                            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                              Los comentarios en esta propuesta deben aportar únicamente recuerdos, fuentes de periódicos, pistas o testimonios <strong>relacionados directamente a este caso</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <span className="text-slate-300">
                            ¿Quieres debatir sobre otros temas, noticias o misterios generales?
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigateTab && onNavigateTab('chat')}
                            className="bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border-2 border-amber-500/60 px-3.5 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ir a la Sala de Debate General</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Input Form */}
                      <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={
                            userProfile?.nickname 
                              ? `Aporta un dato o testimonio sobre esta historia como ${userProfile.nickname}...`
                              : "Registra tu seudónimo y país para comentar..."
                          }
                          className="flex-1 bg-slate-900 border-2 border-slate-700 text-base text-slate-100 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-red-500 font-sans"
                        />
                        <button
                          type="submit"
                          disabled={!commentText.trim()}
                          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-red-950 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Comentar</span>
                        </button>
                      </form>

                      {/* List of comments */}
                      <div className="space-y-2.5 pt-1">
                        {comments.length === 0 ? (
                          <div className="text-center py-6 text-xs sm:text-sm text-slate-400 font-mono bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                            Aún no hay comentarios sobre esta propuesta. ¡Sé el primero en aportar un dato verificado sobre este caso!
                          </div>
                        ) : (
                          comments.map(c => (
                            <div key={c.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-1">
                              <div className="flex justify-between text-slate-400 font-mono">
                                <span className="font-bold text-red-400 flex items-center">
                                  <span className="mr-1">{c.flag || '🇵🇪'}</span> @{c.user} ({c.country || 'Perú'})
                                </span>
                                <span className="text-[10px] text-slate-500">{c.time}</span>
                              </div>
                              <p className="text-slate-200 font-sans pl-5 text-sm leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: AUTORIZACIÓN ADMINISTRATIVA CON BÓVEDA SHA-256 (CLAVE 924571958) */}
      {/* ========================================================================= */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border-2 border-amber-500/80 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative space-y-5 animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => {
                setIsAdminModalOpen(false);
                setPendingAction(null);
                setAdminError("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/80 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/40">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-[11px] font-mono font-bold text-amber-300">
                <Lock className="w-3.5 h-3.5" />
                <span>BÓVEDA PROTEGIDA • GESTIÓN ADMIN</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Autorización Exclusiva del Administrador
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Ingresa tu clave maestra de 9 números para autorizar la edición o eliminación de historias recomendadas.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminVerify} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300">
                  Clave Maestra de 9 Números:
                </label>
                <div className="relative">
                  <input
                    type={showAdminPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={9}
                    autoFocus
                    disabled={lockoutRemaining > 0 || isVerifyingAdmin}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••••• (9 números)"
                    className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white font-mono text-center text-xl tracking-widest py-3 px-10 rounded-xl focus:outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showAdminPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error or Lockout alerts */}
              {lockoutRemaining > 0 ? (
                <div className="p-3 bg-red-950/80 border border-red-500/80 rounded-xl text-xs font-mono text-red-200 text-center flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4 text-red-400 animate-spin" />
                  <span>Panel bloqueado por seguridad. Espera {lockoutRemaining} segundos.</span>
                </div>
              ) : adminError ? (
                <div className="p-3 bg-red-950/80 border border-red-500/80 rounded-xl text-xs font-mono text-red-200 text-center">
                  {adminError}
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={adminPin.length !== 9 || lockoutRemaining > 0 || isVerifyingAdmin}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-bold font-mono py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-950 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isVerifyingAdmin ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verificando Bóveda SHA-256...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Desbloquear Gestión de Historias</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-[10px] font-mono text-slate-400 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>Protección criptográfica SHA-256 + Anti-Fuerza Bruta</span>
                </span>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDICIÓN DE HISTORIA (SOLO ADMINISTRADOR) */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingRec && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1422] border-2 border-amber-500/80 rounded-2xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative space-y-5 my-8 animate-scale-up">
            
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingRec(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/70 flex items-center justify-center text-amber-400 shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Editar Propuesta de Historia
                </h3>
                <p className="text-xs text-slate-300">
                  Enviada originalmente por <strong>@{editingRec.author}</strong> ({editingRec.country || 'Perú'})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Título de la Historia:
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white p-3 rounded-xl focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Lugar o Ciudad:
                  </label>
                  <input
                    type="text"
                    required
                    value={editPlace}
                    onChange={(e) => setEditPlace(e.target.value)}
                    className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white p-3 rounded-xl focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Votos Acumulados:
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editVotes}
                    onChange={(e) => setEditVotes(e.target.value)}
                    className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white p-3 rounded-xl focus:outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Plataforma Asignada:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setEditPlatform('youtube')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all ${
                      editPlatform === 'youtube'
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPlatform('tiktok')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all ${
                      editPlatform === 'tiktok'
                        ? 'bg-cyan-950 border-cyan-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    TikTok
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPlatform('ambas')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all ${
                      editPlatform === 'ambas'
                        ? 'bg-amber-950 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Ambos
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Detalles y Argumento de la Historia:
                </label>
                <textarea
                  rows={4}
                  required
                  value={editStoryDetails}
                  onChange={(e) => setEditStoryDetails(e.target.value)}
                  className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white p-3 rounded-xl focus:outline-none text-sm resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingRec(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center space-x-2 shadow-lg shadow-amber-950 transition-colors"
                >
                  {isSavingEdit ? (
                    <span>Guardando en la Nube...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIRMACIÓN DE ELIMINACIÓN (SOLO ADMINISTRADOR) */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && deletingRec && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border-2 border-red-500/80 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative space-y-5 animate-scale-up">
            
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingRec(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border-2 border-red-500/80 flex items-center justify-center text-red-400 mx-auto shadow-lg shadow-red-950/40">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                ¿Eliminar Propuesta de Historia?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estás a punto de eliminar definitivamente la propuesta:
              </p>
              <div className="bg-[#070a12] p-3 rounded-xl border border-slate-800 text-left">
                <p className="text-sm font-bold text-amber-300">"{deletingRec.title}"</p>
                <p className="text-xs text-slate-400 mt-1">Por: @{deletingRec.author} • {deletingRec.place}</p>
              </div>
              <p className="text-[11px] text-red-400/90 font-mono">
                ⚠️ Esta acción se sincronizará con la base de datos de Supabase y desaparecerá de todos los dispositivos en tiempo real.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingRec(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-500 flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-colors"
              >
                {isDeleting ? (
                  <span>Eliminando...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sí, Eliminar</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
