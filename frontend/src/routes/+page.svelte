<script>
  import DeskScene from '$lib/components/DeskScene.svelte';

  function handleCatClick() {
    // Placeholder: future GSAP animation / easter egg trigger
    console.log('[DeskScene] cat clicked');
  }

  function handleMugClick() {
    // Placeholder: future GSAP animation / easter egg trigger
    console.log('[DeskScene] mug clicked');
  }
</script>

<DeskScene oncatclick={handleCatClick} onmugclick={handleMugClick} />
