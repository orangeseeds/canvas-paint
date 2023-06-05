<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import {selectedTool} from "../stores"

    export let title = "";
    export let img = "";
    let active = false;
    const dispatch = createEventDispatcher();

    $: color = () => {
        if (active) {
            return "text-blue-400";
        }
        return "text-gray-600";
    };

    const unsubscribe = selectedTool.subscribe((data)=>{
        if (data != title.toLowerCase()){
            active = false
        }
    })

    onDestroy(()=>{
        unsubscribe()
    })
</script>

<button
    class="flex text-blue-500 cursor-pointer items-center mb-3 pr-auto justify-center space-x-3 {color()} hover:text-blue-400 outline-0"
    on:click={() => {
        dispatch("click");
        active = !active;
    }}
>
    <!-- <slot /> -->

    {#if img != ""}
        <img src={img} alt="" />
    {/if}
    <span>{title}</span>
</button>
