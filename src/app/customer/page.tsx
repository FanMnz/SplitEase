'use client'

import { useState } from 'react'
import { 
  UserGroupIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  BellIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  dietary: string[]
  popular: boolean
  rating: number
  prepTime: string
}

interface OrderItem {
  menuItem: MenuItem
  quantity: number
  customizations: string[]
  assignedTo: string
}

interface GroupMember {
  id: string
  name: string
  avatar: string
  orders: OrderItem[]
  total: number
  status: 'ordering' | 'ready' | 'confirmed'
}

function MenuItemCard({ item, onAddToCart, isFavorite, onToggleFavorite }: {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  isFavorite: boolean
  onToggleFavorite: (itemId: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 right-3 flex space-x-2">
          {item.popular && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
              Popular
            </span>
          )}
          <button 
            onClick={() => onToggleFavorite(item.id)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 text-white text-sm">
            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
            <span>{item.rating}</span>
            <span>•</span>
            <ClockIcon className="w-4 h-4" />
            <span>{item.prepTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
          <span className="text-xl font-bold text-gray-900">€{item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        {/* Dietary Tags */}
        {item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietary.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button 
          onClick={() => onAddToCart(item)}
          className="w-full btn-touch bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add to Order
        </button>
      </div>
    </div>
  )
}

function OrderSummary({ groupMembers, currentUser, onUpdateQuantity, onRemoveItem }: {
  groupMembers: GroupMember[]
  currentUser: string
  onUpdateQuantity: (memberId: string, itemId: string, quantity: number) => void
  onRemoveItem: (memberId: string, itemId: string) => void
}) {
  const currentMember = groupMembers.find(m => m.id === currentUser)
  const totalBill = groupMembers.reduce((sum, member) => sum + member.total, 0)

  if (!currentMember) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h3>
      
      {currentMember.orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No items in your order yet</p>
      ) : (
        <div className="space-y-4">
          {currentMember.orders.map((order, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{order.menuItem.name}</h4>
                <p className="text-sm text-gray-600">€{order.menuItem.price} each</p>
                {order.customizations.length > 0 && (
                  <p className="text-xs text-gray-500">
                    + {order.customizations.join(', ')}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onUpdateQuantity(currentUser, order.menuItem.id, order.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  disabled={order.quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{order.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(currentUser, order.menuItem.id, order.quantity + 1)}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => onRemoveItem(currentUser, order.menuItem.id)}
                className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Your Total:</span>
              <span className="text-xl font-bold text-gray-900">€{currentMember.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GroupOverview({ groupMembers, onViewMemberOrder }: {
  groupMembers: GroupMember[]
  onViewMemberOrder: (memberId: string) => void
}) {
  const totalBill = groupMembers.reduce((sum, member) => sum + member.total, 0)
  const totalItems = groupMembers.reduce((sum, member) => 
    sum + member.orders.reduce((itemSum, order) => itemSum + order.quantity, 0), 0
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Group Order</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">€{totalBill.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{totalItems} items</p>
        </div>
      </div>

      <div className="space-y-3">
        {groupMembers.map((member) => (
          <div 
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">
                  {member.orders.reduce((sum, order) => sum + order.quantity, 0)} items
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-900">€{member.total.toFixed(2)}</span>
              <button 
                onClick={() => onViewMemberOrder(member.id)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="btn-touch bg-green-500 text-white">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Confirm Order
        </button>
        <button className="btn-touch bg-blue-500 text-white">
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Split Bill
        </button>
      </div>
    </div>
  )
}

export default function CustomerInterface() {
  const [selectedCategory, setSelectedCategory] = useState('appetizers')
  const [favorites, setFavorites] = useState<string[]>(['1', '3'])
  const [activeTab, setActiveTab] = useState<'menu' | 'order' | 'group'>('menu')

  const categories = [
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'mains', name: 'Main Courses', icon: '🍖' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Beverages', icon: '🥤' }
  ]

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese, croutons and our signature caesar dressing',
      price: 12.90,
      category: 'appetizers',
      image: '/caesar-salad.jpg',
      dietary: ['vegetarian'],
      popular: true,
      rating: 4.8,
      prepTime: '10 min'
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce',
      price: 24.50,
      category: 'mains',
      image: '/grilled-salmon.jpg',
      dietary: ['gluten-free', 'keto'],
      popular: false,
      rating: 4.6,
      prepTime: '20 min'
    },
    {
      id: '3',
      name: 'Chocolate Fondant',
      description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
      price: 8.90,
      category: 'desserts',
      image: '/chocolate-fondant.jpg',
      dietary: [],
      popular: true,
      rating: 4.9,
      prepTime: '15 min'
    }
  ]

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    {
      id: 'user1',
      name: 'You',
      avatar: 'you',
      orders: [],
      total: 0,
      status: 'ordering'
    },
    {
      id: 'user2',
      name: 'Emma',
      avatar: 'emma',
      orders: [
        {
          menuItem: menuItems[0],
          quantity: 1,
          customizations: ['extra dressing'],
          assignedTo: 'user2'
        }
      ],
      total: 12.90,
      status: 'confirmed'
    },
    {
      id: 'user3',
      name: 'John',
      avatar: 'john',
      orders: [],
      total: 0,
      status: 'ordering'
    }
  ])

  const currentUser = 'user1'
  const tableInfo = {
    number: '7',
    restaurant: 'Le Gourmet',
    server: 'Emma Wilson'
  }

  const handleAddToCart = (item: MenuItem) => {
    setGroupMembers(prev => prev.map(member => {
      if (member.id === currentUser) {
        const existingOrder = member.orders.find(order => order.menuItem.id === item.id)
        if (existingOrder) {
          return {
            ...member,
            orders: member.orders.map(order => 
              order.menuItem.id === item.id 
                ? { ...order, quantity: order.quantity + 1 }
                : order
            ),
            total: member.total + item.price
          }
        } else {
          return {
            ...member,
            orders: [...member.orders, {
              menuItem: item,
              quantity: 1,
              customizations: [],
              assignedTo: currentUser
            }],
            total: member.total + item.price
          }
        }
      }
      return member
    }))
    setActiveTab('order')
  }

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleUpdateQuantity = (memberId: string, itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(memberId, itemId)
      return
    }

    setGroupMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const updatedOrders = member.orders.map(order => {
          if (order.menuItem.id === itemId) {
            return { ...order, quantity: newQuantity }
          }
          return order
        })
        const newTotal = updatedOrders.reduce((sum, order) => 
          sum + (order.menuItem.price * order.quantity), 0
        )
        return { ...member, orders: updatedOrders, total: newTotal }
      }
      return member
    }))
  }

  const handleRemoveItem = (memberId: string, itemId: string) => {
    setGroupMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const updatedOrders = member.orders.filter(order => order.menuItem.id !== itemId)
        const newTotal = updatedOrders.reduce((sum, order) => 
          sum + (order.menuItem.price * order.quantity), 0
        )
        return { ...member, orders: updatedOrders, total: newTotal }
      }
      return member
    }))
  }

  const filteredItems = menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{tableInfo.restaurant}</h1>
              <p className="text-sm text-gray-600">Table {tableInfo.number} • Server: {tableInfo.server}</p>
            </div>
            <button className="p-2 bg-gray-100 rounded-lg">
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {[
              { id: 'menu', label: 'Menu', icon: '📖' },
              { id: 'order', label: 'My Order', icon: '🛒' },
              { id: 'group', label: 'Group', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Category Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </>
        )}

        {/* Order Tab */}
        {activeTab === 'order' && (
          <OrderSummary
            groupMembers={groupMembers}
            currentUser={currentUser}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {/* Group Tab */}
        {activeTab === 'group' && (
          <GroupOverview
            groupMembers={groupMembers}
            onViewMemberOrder={(memberId) => console.log('View member order:', memberId)}
          />
        )}
      </div>

      {/* Floating Order Summary */}
      {activeTab === 'menu' && groupMembers.find(m => m.id === currentUser)?.orders.length! > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <button 
            onClick={() => setActiveTab('order')}
            className="w-full bg-blue-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCartIcon className="w-6 h-6" />
              <div className="text-left">
                <p className="font-medium">View Order</p>
                <p className="text-sm opacity-90">
                  {groupMembers.find(m => m.id === currentUser)?.orders.reduce((sum, order) => sum + order.quantity, 0)} items
                </p>
              </div>
            </div>
            <span className="text-xl font-bold">
              €{groupMembers.find(m => m.id === currentUser)?.total.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}