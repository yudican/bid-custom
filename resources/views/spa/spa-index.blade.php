<x-app-layout>
  <div class="page-inner {{ $is_dark_mode ? 'bg-black' : 'bg-gray-50' }}">
    <div id="spa-index"></div>
  </div>
</x-app-layout>

<script>
  {
    const darkMode =
      JSON.parse(localStorage.getItem("user_data")).dark_mode === 1
        ? true
        : false;
    console.log(darkMode, "dark mode");
  }
</script>
