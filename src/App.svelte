<script>
    import { onMount } from "svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import { toolsInfo } from "./stores";
    import circle from "./assets/icons/circle.svg"

    let width;
    let height;
    let prevMouseX;
    let prevMouseY;
    let snapshot;
    let isDrawing = false;

    let selectedTool;
    let brushWidth;
    let selectedColor;
    let fillColor;

    toolsInfo.subscribe((data) => {
        // @ts-ignore
        selectedTool = data.selectedTool;
        // @ts-ignore
        brushWidth = data.brushWidth;
        // @ts-ignore
        selectedColor = data.selectedColor;
        // @ts-ignore
        fillColor = data.fillColor;
        console.log(selectedColor);
    });

    let canvas;
    let ctx;

    // @ts-ignore
    $: () => {
        width = canvas.width;
        height = canvas.height;
    };

    onMount(() => {
        ctx = canvas.getContext("2d");
    });

    const setCanvasBackground = (ctx) => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = selectedColor;
    };

    const setup = (canvas, ctx) => {
        canvas.width = canvas.offsetWidth * 3.5;
        canvas.height = canvas.offsetHeight * 1.2;
        setCanvasBackground(ctx);
    };

    const drawRect = (e) => {
        if (!fillColor) {
            return ctx.strokeRect(
                e.offsetX,
                e.offsetY,
                prevMouseX - e.offsetX,
                prevMouseY - e.offsetY
            );
        }
        ctx.fillRect(
            e.offsetX,
            e.offsetY,
            prevMouseX - e.offsetX,
            prevMouseY - e.offsetY
        );
    };

    const drawEllipse = (e) => {
        ctx.beginPath();
        let radiusX = Math.abs(prevMouseX - e.offsetX);
        let radiusY = Math.abs(prevMouseY - e.offsetY);
        let centerX = (prevMouseX + e.offsetX) / 2;
        let centerY = (prevMouseY + e.offsetY) / 2;
        let rotation = 0; // Set the rotation angle if needed

        ctx.ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            rotation,
            0,
            2 * Math.PI
        );
        fillColor ? ctx.fill() : ctx.stroke();
    };
    const drawCircle = (e) => {
        ctx.beginPath();
        let radius = Math.sqrt(
            Math.pow(prevMouseX - e.offsetX, 2) +
                Math.pow(prevMouseY - e.offsetY, 2)
        );
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        fillColor ? ctx.fill() : ctx.stroke();
    };

    const drawTriangle = (e) => {
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
        ctx.closePath();
        fillColor ? ctx.fill() : ctx.stroke();
    };

    const startDraw = (e) => {
        isDrawing = true;
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const drawing = (e) => {
        if (!isDrawing) return;
        ctx.putImageData(snapshot, 0, 0);

        if (selectedTool === "brush" || selectedTool === "eraser") {
            ctx.strokeStyle =
                selectedTool === "eraser" ? "#fff" : selectedColor;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (selectedTool === "rectangle") {
            drawRect(e);
        } else if (selectedTool === "ellipse") {
            drawEllipse(e);
        } else if (selectedTool === "circle") {
            drawCircle(e);
        } else {
            drawTriangle(e);
        }
    };

    const clearScreen = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground(ctx);
    };

    const saveAndDownload = () => {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    };
</script>

<div class="flex w-full p-2.5 w-max-screen space-x-3">
    <section class="flex overflow-hidden border">
        <canvas
            class="w-full h-full"
            bind:this={canvas}
            on:mouseup={() => {
                isDrawing = false;
            }}
            on:mousedown={startDraw}
            on:mousemove={drawing}

            style="cursor: url({'./assets/icons/circle.svg'}) auto;"
        />
    </section>
    <Toolbar on:clear={() => clearScreen()} on:save={() => saveAndDownload()} />
</div>

<svelte:window on:load={() => setup(canvas, ctx)} />
