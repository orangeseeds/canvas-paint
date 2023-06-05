<script>
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    const notifyClick = () => {
        dispatch("click");
    };

    export let cssClass = "text-gray-500";
</script>

<button
    class="w-full text-gray-500 outline-0 mb-4 rounded p-2.5 border border-1 border-gray-500 cursor-pointer hover:text-white hover:bg-gray-500 transition duration-300 ease-in-out {cssClass}"
    on:click={notifyClick}
>
    <slot />
</button>

<style>
</style>
