// Vercel'in hata vermesini engelleyen geçici bağlantı
export const supabase = {
  from: () => ({
    select: () => ({ eq: async () => ({ data: [] }), then: (cb) => cb({ data: [] }) }),
    insert: async () => ({ error: null })
  }),
  storage: { 
    from: () => ({ 
      upload: async () => ({ error: null }), 
      getPublicUrl: () => ({ data: { publicUrl: '' } }) 
    }) 
  }
};