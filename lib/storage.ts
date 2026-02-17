// Local storage management for app data

export interface Listing {
  id: string
  title: string
  price: string
  description: string
  location: string
  category: string
  images: string[]
  seller: {
    id: string
    name: string
    verified: boolean
    rating: number
  }
  escrow: boolean
  localDelivery: boolean
  createdAt: string
  likes: number
  likedBy: string[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  listingId: string
  listingTitle: string
  participants: {
    id: string
    name: string
  }[]
  lastMessage: string
  lastMessageTime: string
  unread: number
}

export interface EscrowTransaction {
  id: string
  listingId: string
  listingTitle: string
  buyerId: string
  sellerId: string
  amount: string
  status: 'pending' | 'confirmed' | 'released' | 'disputed'
  createdAt: string
}

// Storage keys
const KEYS = {
  LISTINGS: 'pilocal_listings',
  FAVORITES: 'pilocal_favorites',
  MESSAGES: 'pilocal_messages',
  CONVERSATIONS: 'pilocal_conversations',
  ESCROW: 'pilocal_escrow',
  USER_LISTINGS: 'pilocal_user_listings',
}

// Listings Management
export function getAllListings(): Listing[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(KEYS.LISTINGS)
  return data ? JSON.parse(data) : []
}

export function addListing(listing: Listing): void {
  const listings = getAllListings()
  listings.unshift(listing)
  localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings))
}

export function getUserListings(userId: string): Listing[] {
  return getAllListings().filter(listing => listing.seller.id === userId)
}

export function deleteListing(listingId: string): void {
  const listings = getAllListings().filter(l => l.id !== listingId)
  localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings))
}

// Favorites Management (unified with likes)
export function getFavorites(userId: string): string[] {
  return getAllListings()
    .filter(listing => listing.likedBy?.includes(userId))
    .map(listing => listing.id)
}

export function getFavoriteListings(userId: string): Listing[] {
  return getAllListings().filter(listing => listing.likedBy?.includes(userId))
}

// Messages Management
export function getConversations(userId: string): Conversation[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(`${KEYS.CONVERSATIONS}_${userId}`)
  return data ? JSON.parse(data) : []
}

export function addConversation(userId: string, conversation: Conversation): void {
  const conversations = getConversations(userId)
  const existing = conversations.find(c => c.id === conversation.id)
  if (!existing) {
    conversations.unshift(conversation)
    localStorage.setItem(`${KEYS.CONVERSATIONS}_${userId}`, JSON.stringify(conversations))
  }
}

export function getMessages(conversationId: string): Message[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(`${KEYS.MESSAGES}_${conversationId}`)
  return data ? JSON.parse(data) : []
}

export function addMessage(message: Message): void {
  const messages = getMessages(message.conversationId)
  messages.push(message)
  localStorage.setItem(`${KEYS.MESSAGES}_${message.conversationId}`, JSON.stringify(messages))
  
  // Update conversation last message
  updateConversationLastMessage(message)
}

function updateConversationLastMessage(message: Message): void {
  // Update for both sender and receiver
  [message.senderId, message.receiverId].forEach(userId => {
    const conversations = getConversations(userId)
    const conv = conversations.find(c => c.id === message.conversationId)
    if (conv) {
      conv.lastMessage = message.content
      conv.lastMessageTime = message.timestamp
      if (userId === message.receiverId) {
        conv.unread = (conv.unread || 0) + 1
      }
      localStorage.setItem(`${KEYS.CONVERSATIONS}_${userId}`, JSON.stringify(conversations))
    }
  })
}

export function markConversationAsRead(userId: string, conversationId: string): void {
  const conversations = getConversations(userId)
  const conv = conversations.find(c => c.id === conversationId)
  if (conv) {
    conv.unread = 0
    localStorage.setItem(`${KEYS.CONVERSATIONS}_${userId}`, JSON.stringify(conversations))
  }
}

// Escrow Transactions
export function getEscrowTransactions(userId: string): EscrowTransaction[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(`${KEYS.ESCROW}_${userId}`)
  return data ? JSON.parse(data) : []
}

export function addEscrowTransaction(userId: string, transaction: EscrowTransaction): void {
  const transactions = getEscrowTransactions(userId)
  transactions.unshift(transaction)
  localStorage.setItem(`${KEYS.ESCROW}_${userId}`, JSON.stringify(transactions))
}

export function updateEscrowStatus(userId: string, transactionId: string, status: EscrowTransaction['status']): void {
  const transactions = getEscrowTransactions(userId)
  const transaction = transactions.find(t => t.id === transactionId)
  if (transaction) {
    transaction.status = status
    localStorage.setItem(`${KEYS.ESCROW}_${userId}`, JSON.stringify(transactions))
  }
}

// Likes Management
export function toggleLike(listingId: string, userId: string): boolean {
  const listings = getAllListings()
  const listing = listings.find(l => l.id === listingId)
  if (listing) {
    if (!listing.likedBy) listing.likedBy = []
    const index = listing.likedBy.indexOf(userId)
    if (index > -1) {
      listing.likedBy.splice(index, 1)
      listing.likes = Math.max(0, (listing.likes || 0) - 1)
    } else {
      listing.likedBy.push(userId)
      listing.likes = (listing.likes || 0) + 1
    }
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings))
    return index === -1 // returns true if liked, false if unliked
  }
  return false
}

export function isLiked(listingId: string, userId: string): boolean {
  const listings = getAllListings()
  const listing = listings.find(l => l.id === listingId)
  return listing?.likedBy?.includes(userId) || false
}
