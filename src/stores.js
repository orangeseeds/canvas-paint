import { writable } from "svelte/store";

export let canvasInfo = writable({})

export let selectedTool  = writable("")
export let toolsInfo  = writable({})
