import React, { useState } from 'react'
import { useLearning } from '@/contexts/learning-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import {
  FileText,
  Pin,
  Paperclip,
  Plus,
  Calendar,
  User,
  Download,
  BookOpen,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function ClassPostsView() {
  const { classPosts, createClassPost, togglePinPost } = useLearning()
  const { sections, batches, subjects } = useAcademic()
  const { userRole, hasPermission } = useAuth()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    cohortName: sections[0]?.name || 'Grade 10 - Section A',
    subjectName: subjects[0]?.name || 'Mathematics',
    attachmentName: '',
    isPinned: false,
  })

  const canPost =
    userRole === 'institution_admin' ||
    userRole === 'teacher' ||
    (userRole === 'manager' && hasPermission('class_posts.create'))

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return

    createClassPost({
      title: form.title,
      content: form.content,
      cohortName: form.cohortName,
      subjectName: form.subjectName,
      attachmentName: form.attachmentName,
      isPinned: form.isPinned,
    })

    setIsCreateOpen(false)
    setForm({
      title: '',
      content: '',
      cohortName: sections[0]?.name || 'Grade 10 - Section A',
      subjectName: subjects[0]?.name || 'Mathematics',
      attachmentName: '',
      isPinned: false,
    })
  }

  // Sort pinned posts first
  const sortedPosts = [...classPosts].sort((a, b) => {
    if (a.is_pinned === b.is_pinned) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return a.is_pinned ? -1 : 1
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Class Posting & Digital Learning Materials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Publish educational announcements, curriculum handouts, and study materials targeted to student cohorts.
          </p>
        </div>

        {canPost && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Create Class Post
          </Button>
        )}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm font-semibold">No class posts published yet.</p>
            <p className="text-xs">Authorized teachers and supervisors can publish learning handouts here.</p>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card
              key={post.id}
              className={`border transition-all ${
                post.is_pinned ? 'border-primary/40 bg-blue-50/20 shadow-sm' : 'hover:shadow-sm'
              }`}
            >
              <CardHeader className="p-4 sm:p-5 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {post.is_pinned && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-[10px] flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Pinned
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {post.cohort_name}
                    </Badge>
                    {post.subject_name && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {post.subject_name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {canPost && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => togglePinPost(post.id)}
                      >
                        <Pin className="h-3 w-3 mr-1" />
                        {post.is_pinned ? 'Unpin' : 'Pin'}
                      </Button>
                    )}
                  </div>
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-2">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    Posted by <strong className="text-foreground">{post.author_name}</strong> (
                    <span className="capitalize">{post.author_role.replace('_', ' ')}</span>)
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-2 space-y-4">
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>

                {/* Attachments Section */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="pt-2 border-t space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5 text-primary" /> Learning Attachments & Study Notes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 border rounded-md text-xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <span className="font-medium text-foreground">{att.name}</span>
                            <span className="text-[10px] text-muted-foreground block">{att.size}</span>
                          </div>
                          <Download className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* MODAL: CREATE CLASS POST */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Publish Class Post & Learning Material</DialogTitle>
            <DialogDescription>
              Share lecture summaries, digital notes, and study handouts with your class.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePostSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Post Headline / Topic Title *</Label>
              <Input
                placeholder="e.g. Chapter 5: Organic Reaction Mechanisms Handout"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Target Cohort *</Label>
                <Select
                  value={form.cohortName}
                  onChange={(e) => setForm({ ...form, cohortName: e.target.value })}
                >
                  <optgroup label="School Sections">
                    {sections.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Coaching Batches">
                    {batches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </optgroup>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Subject Curriculum</Label>
                <Select
                  value={form.subjectName}
                  onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Post Content & Study Instructions *</Label>
              <textarea
                rows={4}
                placeholder="Provide detailed lecture notes, study recommendations, or instructions..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Attach PDF Handout / Document File Name</Label>
              <Input
                placeholder="e.g. Organic_Reactions_Summary_Notes.pdf"
                value={form.attachmentName}
                onChange={(e) => setForm({ ...form, attachmentName: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">
                Simulates pre-signed Supabase Storage upload to <code>class-materials</code> bucket.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pin-post"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
              />
              <Label htmlFor="pin-post" className="cursor-pointer font-medium text-xs">
                Pin this post to the top of the student class feed
              </Label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Publish Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
