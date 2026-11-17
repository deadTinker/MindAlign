import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import {
  ArrowLeft, ArrowUpRight, BookOpen, Clock3, Edit3, Heart, MessageCircle,
  MoreHorizontal, PenLine, Search, Send, Sparkles, TrendingUp, Users, X,
  Trash2, Image as ImageIcon
} from 'lucide-react'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/community`
const CATEGORIES = ['All topics', 'Mental Wellness', 'Student Life', 'Personal Growth', 'Relationships', 'Productivity', 'Experiences']
const token = () => localStorage.getItem('token')
const headers = (json = false) => ({ ...(json ? { 'Content-Type': 'application/json' } : {}), Authorization: `Bearer ${token()}` })
const dateLabel = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  const delta = Math.max(0, Date.now() - date.getTime())
  if (delta < 60000) return 'Just now'
  if (delta < 3600000) return `${Math.floor(delta / 60000)}m ago`
  if (delta < 86400000) return `${Math.floor(delta / 3600000)}h ago`
  if (delta < 604800000) return `${Math.floor(delta / 86400000)}d ago`
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
const initials = (name = 'Member') => name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
async function request(url, options = {}) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong. Please try again.')
  return data
}

function Avatar({ author, size = 'md' }) {
  const dimensions = size === 'lg' ? 'h-12 w-12 text-sm' : size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs'
  return author?.avatar
    ? <img src={author.avatar} alt="" className={`${dimensions} shrink-0 rounded-2xl object-cover ring-1 ring-white/10`} />
    : <div className={`${dimensions} shrink-0 rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center font-semibold text-cyan-100`}>{initials(author?.name)}</div>
}

function Community() {
  const { articleId, userId } = useParams()
  const navigate = useNavigate()
  const isDetail = Boolean(articleId)
  const isProfile = Boolean(userId)
  const [articles, setArticles] = useState([])
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [profile, setProfile] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [sort, setSort] = useState('latest')
  const [category, setCategory] = useState('All topics')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Mental Wellness', content: '', coverImage: '' })
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const loadFeed = useCallback(async ({ reset = false, requestedPage = 1 } = {}) => {
    setLoading(true); setError('')
    const nextPage = reset ? 1 : requestedPage
    try {
      const params = new URLSearchParams({ page: String(nextPage), limit: '10', sort })
      if (category !== 'All topics') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      const data = await request(`${API}/articles?${params}`, { headers: headers() })
      setArticles((current) => reset ? data.articles : [...current, ...data.articles])
      setHasMore(Boolean(data.hasMore)); setPage(nextPage)
    } catch (err) { setError(err.message); if (reset) setArticles([]) }
    finally { setLoading(false) }
  }, [sort, category, search])

  const loadArticle = useCallback(async () => {
    setDetailLoading(true); setError(''); setArticle(null)
    try {
      const data = await request(`${API}/articles/${articleId}`, { headers: headers() })
      setArticle(data.article); setComments(data.comments || [])
    } catch (err) { setError(err.message) }
    finally { setDetailLoading(false) }
  }, [articleId])

  const loadProfile = useCallback(async () => {
    setDetailLoading(true); setError('')
    try {
      const [profileData, articleData] = await Promise.all([
        request(`${API}/users/${userId}`, { headers: headers() }),
        request(`${API}/users/${userId}/articles`, { headers: headers() })
      ])
      setProfile(profileData.user); setArticles(articleData.articles || [])
    } catch (err) { setError(err.message) }
    finally { setDetailLoading(false) }
  }, [userId])

  useEffect(() => {
    if (!isDetail && !isProfile) loadFeed({ reset: true })
  }, [isDetail, isProfile, loadFeed])
  useEffect(() => { if (isDetail) loadArticle() }, [isDetail, loadArticle])
  useEffect(() => { if (isProfile) loadProfile() }, [isProfile, loadProfile])
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const stats = useMemo(() => ({ stories: articles.length, likes: articles.reduce((sum, item) => sum + (item.likesCount || 0), 0) }), [articles])

  const toggleLike = async (item) => {
    const previous = item
    const liked = !item.likedByMe
    const optimistic = (entry) => entry.id === item.id ? { ...entry, likedByMe: liked, likesCount: Math.max(0, (entry.likesCount || 0) + (liked ? 1 : -1)) } : entry
    setArticles((current) => current.map(optimistic))
    if (isDetail) setArticle((current) => current ? optimistic(current) : current)
    try {
      const data = await request(`${API}/articles/${item.id}/like`, { method: 'POST', headers: headers() })
      const update = (entry) => entry.id === item.id ? { ...entry, likedByMe: data.liked, likesCount: data.likesCount } : entry
      setArticles((current) => current.map(update)); setArticle((current) => current ? update(current) : current)
    } catch (err) {
      const rollback = (entry) => entry.id === previous.id ? previous : entry
      setArticles((current) => current.map(rollback)); setArticle((current) => current?.id === previous.id ? previous : current); setNotice(err.message)
    }
  }

  const openNewArticle = () => { setEditing(false); setForm({ title: '', category: 'Mental Wellness', content: '', coverImage: '' }); setShowComposer(true) }
  const openEditArticle = () => { setEditing(true); setForm({ title: article.title, category: article.category, content: article.content, coverImage: article.coverImage || '' }); setShowComposer(true); setMenuOpen(false) }
  const publishArticle = async (event) => {
    event.preventDefault(); setSubmitting(true); setNotice('')
    try {
      const data = await request(editing ? `${API}/articles/${articleId}` : `${API}/articles`, {
        method: editing ? 'PUT' : 'POST', headers: headers(true), body: JSON.stringify(form)
      })
      setShowComposer(false); setNotice(editing ? 'Article updated.' : 'Your article is now published.')
      if (editing) { setArticle(data.article); setArticles((current) => current.map((item) => item.id === data.article.id ? data.article : item)) }
      else navigate(`/community/${data.article.id}`)
    } catch (err) { setNotice(err.message) }
    finally { setSubmitting(false) }
  }

  const deleteArticle = async () => {
    if (!window.confirm('Delete this article? This will also remove its comments and replies.')) return
    try { await request(`${API}/articles/${articleId}`, { method: 'DELETE', headers: headers() }); navigate('/community') }
    catch (err) { setNotice(err.message) }
  }

  const sendComment = async (event, parentId = null) => {
    event.preventDefault()
    const content = parentId ? replyText.trim() : commentText.trim()
    if (!content) return
    try {
      const data = await request(`${API}/articles/${articleId}/comments`, { method: 'POST', headers: headers(true), body: JSON.stringify({ content, ...(parentId ? { parentId } : {}) }) })
      if (parentId) {
        setComments((current) => current.map((comment) => comment.id === parentId ? { ...comment, replies: [...(comment.replies || []), data.comment] } : comment))
        setReplyText(''); setReplyTo(null)
      } else { setComments((current) => [...current, { ...data.comment, replies: [] }]); setCommentText('') }
      setArticle((current) => current ? { ...current, commentsCount: (current.commentsCount || 0) + 1 } : current)
    } catch (err) { setNotice(err.message) }
  }

  const toggleCommentLike = async (commentId, parentId = null) => {
    const updateLocal = (list, id, data) => list.map((comment) => comment.id === id ? { ...comment, ...data } : comment)
    const locate = (list) => {
      for (const comment of list) { if (comment.id === commentId) return comment; const reply = (comment.replies || []).find((item) => item.id === commentId); if (reply) return reply }
      return null
    }
    const existing = locate(comments); if (!existing) return
    const wasLiked = existing.likedByMe
    const patch = { likedByMe: !wasLiked, likesCount: Math.max(0, (existing.likesCount || 0) + (wasLiked ? -1 : 1)) }
    setComments((current) => parentId ? current.map((comment) => comment.id === parentId ? { ...comment, replies: updateLocal(comment.replies || [], commentId, patch) } : comment) : updateLocal(current, commentId, patch))
    try {
      const data = await request(`${API}/comments/${commentId}/like`, { method: 'POST', headers: headers() })
      const finalPatch = { likedByMe: data.liked, likesCount: data.likesCount }
      setComments((current) => parentId ? current.map((comment) => comment.id === parentId ? { ...comment, replies: updateLocal(comment.replies || [], commentId, finalPatch) } : comment) : updateLocal(current, commentId, finalPatch))
    } catch (err) { setNotice(err.message); loadArticle() }
  }

  const deleteComment = async (commentId, parentId = null) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      const data = await request(`${API}/comments/${commentId}`, { method: 'DELETE', headers: headers() })
      setComments((current) => parentId ? current.map((comment) => comment.id === parentId ? { ...comment, replies: (comment.replies || []).filter((reply) => reply.id !== commentId) } : comment) : current.filter((comment) => comment.id !== commentId))
      setArticle((current) => current ? { ...current, commentsCount: Math.max(0, current.commentsCount - (data.deletedCount || 1)) } : current)
    } catch (err) { setNotice(err.message) }
  }

  const goBack = () => navigate('/community')
  const loadMore = () => loadFeed({ requestedPage: page + 1 })

return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      {/* Subtle Light Ambient Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[25%] h-[420px] w-[420px] rounded-full bg-emerald-400/[0.08] blur-[120px]" />
        <div className="absolute right-[-180px] top-[35%] h-[380px] w-[380px] rounded-full bg-teal-400/[0.07] blur-[110px]" />
      </div>

      <Sidebar />

      <main className="relative z-10 ml-0 min-h-screen px-5 pb-16 pt-24 md:ml-64 md:px-10 md:pt-8 lg:px-14">
        <div className="mx-auto max-w-6xl">
          {(isDetail || isProfile) && (
            <button
              onClick={goBack}
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#16A34A]"
            >
              <ArrowLeft size={16} /> Back to community
            </button>
          )}

          {notice && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-[#16A34A] shadow-2xs">
              <span>{notice}</span>
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss"
                className="text-emerald-700/70 hover:text-[#15803D]"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {!isDetail && !isProfile && (
            <>
              <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">
                    <Users size={14} /> The MindAlign community
                  </div>
                  <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    You’re not figuring it all out{' '}
                    <span className="text-[#22C55E]">alone.</span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Read real experiences, exchange perspectives and share what you’ve learned along the way.
                  </p>
                </div>
                <button
                  onClick={openNewArticle}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:-translate-y-0.5"
                >
                  <PenLine size={16} /> Write an article
                </button>
              </header>

              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <BookOpen size={14} className="text-[#16A34A]" /> Stories in this view
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stats.stories}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Heart size={14} className="text-rose-500" /> Appreciation
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stats.likes}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Users size={14} className="text-teal-600" /> A space for
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    Honest, respectful conversation
                  </p>
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 transition-colors focus-within:border-[#22C55E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#22C55E]/20">
                  <Search size={17} className="shrink-0 text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search stories, ideas and experiences..."
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
                    SEARCH
                  </kbd>
                </label>

                <div className="flex rounded-xl border border-slate-200 bg-slate-50/90 p-1">
                  <button
                    onClick={() => setSort('latest')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      sort === 'latest'
                        ? 'bg-white text-[#16A34A] shadow-2xs border border-emerald-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Clock3 size={14} /> Latest
                  </button>
                  <button
                    onClick={() => setSort('popular')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      sort === 'popular'
                        ? 'bg-white text-[#16A34A] shadow-2xs border border-emerald-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <TrendingUp size={14} /> Popular
                  </button>
                </div>
              </div>

              <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
                      category === item
                        ? 'border-emerald-300 bg-emerald-50 text-[#16A34A] font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {isProfile && (
            <div className="mb-8 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 shadow-sm sm:p-8">
              {detailLoading ? (
                <LoadingState label="Loading contributor" />
              ) : error ? (
                <ErrorState message={error} onRetry={loadProfile} />
              ) : (
                profile && (
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <Avatar author={{ name: profile.name, avatar: profile.avatar }} size="lg" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                        Community contributor
                      </p>
                      <h1 className="mt-1 text-2xl font-bold text-slate-900">{profile.name}</h1>
                      <p className="mt-1 text-sm text-slate-500">
                        {articles.length} published {articles.length === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {isDetail && (
            <>
              {detailLoading ? (
                <LoadingState label="Loading article" />
              ) : error ? (
                <ErrorState message={error} onRetry={loadArticle} />
              ) : (
                article && (
                  <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                          {article.category}
                        </span>
                        <span className="text-xs text-slate-500">{dateLabel(article.createdAt)}</span>
                      </div>

                      {article.isAuthor && (
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen((value) => !value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Article options"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {menuOpen && (
                            <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                              <button
                                onClick={openEditArticle}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit3 size={14} /> Edit article
                              </button>
                              <button
                                onClick={deleteArticle}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={14} /> Delete article
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                      {article.title}
                    </h1>

                    <Link
                      to={`/community/user/${article.author?.id}`}
                      className="mt-6 flex items-center gap-3 border-b border-slate-200 pb-6 group"
                    >
                      <Avatar author={article.author} size="lg" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#16A34A] transition-colors">
                          {article.author?.name || 'MindAlign member'}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">View contributor profile</p>
                      </div>
                    </Link>

                    {article.coverImage && (
                      <img
                        src={article.coverImage}
                        alt="Article cover"
                        className="mt-7 max-h-[440px] w-full rounded-2xl border border-slate-200 object-cover"
                      />
                    )}

                    <div className="mt-8 whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700">
                      {article.content}
                    </div>

                    <div className="mt-8 flex items-center gap-5 border-y border-slate-200 py-4">
                      <button
                        onClick={() => toggleLike(article)}
                        className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                          article.likedByMe
                            ? 'text-rose-600'
                            : 'text-slate-500 hover:text-rose-600'
                        }`}
                      >
                        <Heart size={18} fill={article.likedByMe ? 'currentColor' : 'none'} />
                        {article.likesCount} likes
                      </button>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                        <MessageCircle size={18} />
                        {article.commentsCount} comments
                      </span>
                    </div>

                    <section className="mt-9">
                      <div className="mb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                          Conversation{' '}
                          <span className="ml-1 text-sm font-normal text-slate-400">
                            ({article.commentsCount || 0})
                          </span>
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Keep it constructive. Different perspectives are welcome.
                        </p>
                      </div>

                      <form
                        onSubmit={(event) => sendComment(event)}
                        className="mb-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 focus-within:border-[#22C55E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all"
                      >
                        <textarea
                          value={commentText}
                          onChange={(event) => setCommentText(event.target.value)}
                          placeholder="Add to the conversation..."
                          maxLength={2000}
                          rows={3}
                          className="w-full resize-y bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {commentText.length}/2,000
                          </span>
                          <button
                            disabled={!commentText.trim()}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] px-4 py-2 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Send size={14} /> Comment
                          </button>
                        </div>
                      </form>

                      {comments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-10 text-center">
                          <MessageCircle className="mx-auto mb-3 text-slate-400" />
                          <p className="text-sm text-slate-500">
                            No comments yet. Start the conversation.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {comments.map((comment) => (
                            <CommentThread
                              key={comment.id}
                              comment={comment}
                              replyTo={replyTo}
                              setReplyTo={setReplyTo}
                              replyText={replyText}
                              setReplyText={setReplyText}
                              sendComment={sendComment}
                              toggleLike={toggleCommentLike}
                              deleteComment={deleteComment}
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  </article>
                )
              )}
            </>
          )}

          {!isDetail &&
            !isProfile &&
            (error ? (
              <ErrorState message={error} onRetry={() => loadFeed({ reset: true })} />
            ) : loading && articles.length === 0 ? (
              <LoadingState label="Loading community" />
            ) : articles.length === 0 ? (
              <EmptyState
                onWrite={openNewArticle}
                searching={Boolean(search || category !== 'All topics')}
              />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    {sort === 'popular' ? 'Popular with the community' : 'Fresh from the community'}
                  </p>
                  <span className="text-xs text-slate-400">{articles.length} shown</span>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {articles.map((item) => (
                    <ArticleCard
                      key={item.id}
                      article={item}
                      onOpen={() => navigate(`/community/${item.id}`)}
                      onLike={() => toggleLike(item)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      disabled={loading}
                      onClick={loadMore}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-2xs transition hover:border-[#22C55E] hover:text-[#16A34A] disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load more articles'}
                    </button>
                  </div>
                )}

                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Sparkles size={13} className="text-[#22C55E]" /> A thoughtful community begins with thoughtful conversations.
                </div>
              </>
            ))}

          {isProfile && !detailLoading && !error && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Published articles</h2>
                <button
                  onClick={openNewArticle}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#16A34A] hover:text-[#15803D]"
                >
                  <PenLine size={14} /> Write an article
                </button>
              </div>
              {articles.length ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {articles.map((item) => (
                    <ArticleCard
                      key={item.id}
                      article={item}
                      onOpen={() => navigate(`/community/${item.id}`)}
                      onLike={() => toggleLike(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center text-sm text-slate-500">
                  This contributor hasn’t published anything yet.
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {showComposer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6">
          <form
            onSubmit={publishArticle}
            className="my-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
                  Community contribution
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-slate-900">
                  {editing ? 'Edit your article' : 'Write an article'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Share something useful, honest or meaningful.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Title</span>
                <input
                  required
                  minLength={4}
                  maxLength={180}
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Give your article a clear title"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                >
                  {CATEGORIES.filter((item) => item !== 'All topics').map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Article</span>
                <textarea
                  required
                  minLength={30}
                  maxLength={30000}
                  rows={6}
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  placeholder="Start writing. Share a lesson, experience, reflection or practical advice..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                />
                <span className="mt-1 block text-right text-[11px] text-slate-400">
                  {form.content.length.toLocaleString()}/30,000 characters
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Cover image URL <span className="font-normal text-slate-400">(optional, HTTPS)</span>
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50/90 px-3 focus-within:border-[#22C55E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#22C55E]/20">
                  <ImageIcon size={16} className="text-slate-400" />
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(event) => setForm({ ...form, coverImage: event.target.value })}
                    placeholder="https://..."
                    className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={
                  submitting || form.content.trim().length < 30 || form.title.trim().length < 4
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Send size={15} />
                    {editing ? 'Save changes' : 'Publish article'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
function ArticleCard({ article, onOpen, onLike }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xs transition duration-300 hover:-translate-y-1 hover:border-[#22C55E]/50 hover:shadow-lg hover:shadow-emerald-500/10">
      {article.coverImage && (
        <button onClick={onOpen} className="block h-48 w-full overflow-hidden border-b border-slate-100">
          <img
            src={article.coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </button>
      )}
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-[#16A34A]">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock3 size={13} />
            {dateLabel(article.createdAt)}
          </span>
        </div>

        <button onClick={onOpen} className="block w-full text-left">
          <h2 className="text-lg font-bold leading-7 text-slate-900 transition group-hover:text-[#16A34A]">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
            {article.excerpt || article.content}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A]">
            Read article <ArrowUpRight size={14} />
          </span>
        </button>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <Link
            to={`/community/user/${article.author?.id}`}
            onClick={(event) => event.stopPropagation()}
            className="flex min-w-0 items-center gap-2.5 group/author"
          >
            <Avatar author={article.author} />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800 transition-colors group-hover/author:text-[#16A34A]">
                {article.author?.name || 'MindAlign member'}
              </p>
              <p className="text-[11px] text-slate-400">View contributor</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              aria-label={article.likedByMe ? 'Unlike article' : 'Like article'}
              className={`inline-flex items-center gap-1.5 text-xs font-medium transition ${
                article.likedByMe
                  ? 'text-rose-600'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <Heart size={16} fill={article.likedByMe ? 'currentColor' : 'none'} />
              {article.likesCount || 0}
            </button>
            <button
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#16A34A]"
            >
              <MessageCircle size={16} />
              {article.commentsCount || 0}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function CommentThread({
  comment,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  sendComment,
  toggleLike,
  deleteComment,
}) {
  return (
    <div className="flex gap-3">
      <Avatar author={comment.author} />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {comment.author?.name || 'Member'}
            </span>
            <span className="text-[11px] text-slate-400">{dateLabel(comment.createdAt)}</span>
            {comment.isAuthor && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
                You
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {comment.content}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={() => toggleLike(comment.id)}
            className={`inline-flex items-center gap-1 text-xs font-medium transition ${
              comment.likedByMe
                ? 'text-rose-600'
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            <Heart size={13} fill={comment.likedByMe ? 'currentColor' : 'none'} />
            {comment.likesCount || 0}
          </button>
          <button
            onClick={() => {
              setReplyTo(replyTo === comment.id ? null : comment.id)
              setReplyText('')
            }}
            className="text-xs font-medium text-slate-500 transition hover:text-[#16A34A]"
          >
            Reply
          </button>
          {comment.isAuthor && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="text-xs font-medium text-slate-400 transition hover:text-rose-600"
            >
              Delete
            </button>
          )}
        </div>

        {replyTo === comment.id && (
          <form onSubmit={(event) => sendComment(event, comment.id)} className="mt-3 flex gap-2">
            <input
              autoFocus
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder={`Reply to ${comment.author?.name || 'member'}...`}
              maxLength={2000}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50/90 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
            />
            <button
              disabled={!replyText.trim()}
              className="rounded-xl bg-[#22C55E] px-3.5 text-white shadow-sm transition hover:bg-[#16A34A] disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        )}

        {(comment.replies || []).length > 0 && (
          <div className="mt-4 space-y-3 border-l-2 border-emerald-200/80 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2.5">
                <Avatar author={reply.author} size="sm" />
                <div className="min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      {reply.author?.name || 'Member'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {dateLabel(reply.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                    {reply.content}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(reply.id, comment.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium transition ${
                        reply.likedByMe
                          ? 'text-rose-600'
                          : 'text-slate-500 hover:text-rose-600'
                      }`}
                    >
                      <Heart size={12} fill={reply.likedByMe ? 'currentColor' : 'none'} />
                      {reply.likesCount || 0}
                    </button>
                    {reply.isAuthor && (
                      <button
                        onClick={() => deleteComment(reply.id, comment.id)}
                        className="text-[11px] font-medium text-slate-400 transition hover:text-rose-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onWrite, searching }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-[#16A34A]">
        <BookOpen size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">
        {searching ? 'No stories found' : 'Your community starts here'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {searching
          ? 'Try a different search or category to find what you’re looking for.'
          : 'There are no articles here yet. Be the first to share an experience, idea or perspective.'}
      </p>
      {!searching && (
        <button
          onClick={onWrite}
          className="mt-5 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-[#16A34A]"
        >
          Write the first article
        </button>
      )}
    </div>
  )
}

function LoadingState({ label }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-200 border-t-[#22C55E]" />
      <span className="text-sm font-medium">{label}...</span>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-6 text-center">
      <p className="text-sm font-medium text-rose-700">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-2xs transition hover:bg-rose-50"
      >
        Try again
      </button>
    </div>
  )
}

export default Community