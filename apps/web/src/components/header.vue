<template>
  <header class="h-14 bg-blue-600 text-white flex items-center px-4 justify-between shadow">
    <div class="flex items-center gap-6">
      <h1 class="text-lg font-semibold">My Vue App</h1>
      <nav class="flex items-center gap-3">
        <router-link to="/" class="px-3 py-1 hover:bg-white/10 rounded">Trang chủ</router-link>
        <router-link to="/products" class="px-3 py-1 hover:bg-white/10 rounded">Sản phẩm</router-link>
        <router-link to="/suppliers" class="px-3 py-1 hover:bg-white/10 rounded">Nhà cung cấp</router-link>
        <router-link to="/customers" class="px-3 py-1 hover:bg-white/10 rounded">Khách hàng</router-link>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <span>User</span>
      <button class="bg-white/20 px-3 py-1 rounded hover:bg-white/30">Logout</button>
    </div>
  </header>
</template>
