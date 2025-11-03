<template>
  <main class="min-h-screen bg-bg text-text-body p-10 space-y-8">
    <h1 class="text-3xl font-bold text-text-header">🎨 Tailwind v4 Color Showcase</h1>

    <!-- BRAND -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Brand</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <div class="h-16 rounded-lg bg-primary text-primary-contrast flex items-center px-4 font-medium">
          bg-primary
        </div>
        <div class="h-16 rounded-lg bg-primary-hover text-primary-contrast flex items-center px-4 font-medium">
          bg-primary-hover
        </div>
        <div class="h-16 rounded-lg bg-primary-active text-primary-contrast flex items-center px-4 font-medium">
          bg-primary-active
        </div>

        <div class="h-16 rounded-lg bg-secondary text-secondary-contrast flex items-center px-4 font-medium">
          bg-secondary
        </div>
        <div class="h-16 rounded-lg bg-secondary-hover text-secondary-contrast flex items-center px-4 font-medium">
          bg-secondary-hover
        </div>
        <div class="h-16 rounded-lg bg-secondary-active text-secondary-contrast flex items-center px-4 font-medium">
          bg-secondary-active
        </div>

        <div class="h-16 rounded-lg bg-accent text-accent-contrast flex items-center px-4 font-medium">bg-accent</div>
        <div class="h-16 rounded-lg bg-accent-hover text-accent-contrast flex items-center px-4 font-medium">
          bg-accent-hover
        </div>
      </div>
    </section>

    <!-- BACKGROUNDS & SURFACES -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Backgrounds & Surfaces</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <div class="h-16 rounded-lg bg-bg flex items-center px-4 font-medium border border-border-light">bg-bg</div>
        <div class="h-16 rounded-lg bg-bg-muted flex items-center px-4 font-medium border border-border-light">
          bg-bg-muted
        </div>
        <div class="h-16 rounded-lg bg-bg-card flex items-center px-4 font-medium border border-border-light">
          bg-bg-card
        </div>
        <div class="h-16 rounded-lg bg-bg-hover flex items-center px-4 font-medium border border-border-light">
          bg-bg-hover
        </div>
        <div class="h-16 rounded-lg bg-surface flex items-center px-4 font-medium border border-border-light">
          bg-surface
        </div>
      </div>
    </section>

    <!-- TEXT COLORS -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Text</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <div class="p-4 rounded-lg border border-border-light bg-surface">
          <p class="text-text-header font-semibold">text-text-header</p>
          <p class="text-text-body">text-text-body</p>
          <p class="text-text-muted">text-text-muted</p>
          <p class="text-text-disabled">text-text-disabled</p>
        </div>
        <div class="p-4 rounded-lg border border-border-light bg-surface flex items-center">
          <span class="bg-text-contrast text-bg px-3 py-2 rounded-md font-semibold">text-text-contrast</span>
        </div>
        <div class="p-4 rounded-lg border border-border-light bg-surface space-x-2">
          <a href="#" class="text-link underline">text-link</a>
          <a href="#" class="text-link-hover underline">text-link-hover</a>
          <a href="#" class="text-link-visited underline">text-link-visited</a>
        </div>
      </div>
    </section>

    <!-- STATUS -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Status</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="h-16 rounded-lg bg-success text-success-text flex items-center px-4 font-medium">bg-success</div>
        <div class="h-16 rounded-lg bg-warning text-warning-text flex items-center px-4 font-medium">bg-warning</div>
        <div class="h-16 rounded-lg bg-error text-error-text flex items-center px-4 font-medium">bg-error</div>
        <div class="h-16 rounded-lg bg-info text-info-text flex items-center px-4 font-medium">bg-info</div>
      </div>
    </section>

    <!-- BORDERS & RINGS -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Border & Ring</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="p-4 rounded-lg bg-surface border-2 border-border-light">border-light</div>
        <div class="p-4 rounded-lg bg-surface border-2 border-border-strong">border-strong</div>
        <div class="p-4 rounded-lg bg-surface" style="box-shadow: 0 0 0 4px var(--color-ring)">ring</div>
        <div class="p-4 rounded-lg bg-surface border border-border-light">ring-offset</div>
      </div>
    </section>

    <!-- GRADIENTS -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Gradients</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          class="h-20 rounded-lg [background:var(--gradient-primary)] flex items-center px-4 text-text-contrast font-medium"
        >
          gradient-primary
        </div>
        <div
          class="h-20 rounded-lg [background:var(--gradient-surface)] flex items-center px-4 text-text-header font-medium"
        >
          gradient-surface
        </div>
        <div class="h-20 rounded-lg border border-border-light flex items-center justify-center">
          <span class="text-3xl font-bold bg-clip-text text-transparent [background:var(--gradient-text)]"
            >gradient-text</span
          >
        </div>
      </div>
    </section>

    <!-- CHART COLORS -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-text-header">Chart</h2>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div class="h-16 rounded-lg bg-chart-1 flex items-center justify-center text-text-contrast font-medium">
          chart-1
        </div>
        <div class="h-16 rounded-lg bg-chart-2 flex items-center justify-center text-text-contrast font-medium">
          chart-2
        </div>
        <div class="h-16 rounded-lg bg-chart-3 flex items-center justify-center text-text-contrast font-medium">
          chart-3
        </div>
        <div class="h-16 rounded-lg bg-chart-4 flex items-center justify-center text-text-contrast font-medium">
          chart-4
        </div>
        <div class="h-16 rounded-lg bg-chart-5 flex items-center justify-center text-text-contrast font-medium">
          chart-5
        </div>
        <div class="h-16 rounded-lg bg-chart-6 flex items-center justify-center text-text-contrast font-medium">
          chart-6
        </div>
      </div>
    </section>
  </main>
</template>
