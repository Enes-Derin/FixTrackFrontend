import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button, Badge } from "react-bootstrap";

const CANVAS_HEIGHT = 150;

function SignatureCanvas({
    onSave,
    onClear,
    initialSignature,
    readOnly = false,
}) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = CANVAS_HEIGHT * dpr;

        canvas.style.height = `${CANVAS_HEIGHT}px`;
        canvas.style.width = "100%";

        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, rect.width, CANVAS_HEIGHT);

        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;

        if (initialSignature) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, CANVAS_HEIGHT);
                setHasSignature(true);
                setHasSaved(true);
            };
            img.src = initialSignature;
        }
    }, [initialSignature]);

    const getPosition = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };


    const startDrawing = useCallback(
        (e) => {
            if (readOnly) return;
            e.preventDefault();
            const { x, y } = getPosition(e);
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(x, y);
            setIsDrawing(true);
        },
        [readOnly]
    );

    const draw = useCallback(
        (e) => {
            if (!isDrawing || readOnly) return;
            e.preventDefault();
            const { x, y } = getPosition(e);
            ctxRef.current.lineTo(x, y);
            ctxRef.current.stroke();
            setHasSignature(true);
        },
        [isDrawing, readOnly]
    );

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const clearCanvas = () => {
        if (readOnly) return;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setHasSignature(false);
        setHasSaved(false);
        onClear?.();
    };

    const handleSave = () => {
        if (!hasSignature || readOnly) return;

        const canvas = canvasRef.current;

        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;

        const exportCtx = exportCanvas.getContext("2d");
        exportCtx.fillStyle = "#fff";
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(canvas, 0, 0);

        const data = exportCanvas.toDataURL("image/jpeg", 0.85);

        setHasSaved(true);
        onSave?.(data);
    };

    return (
        <div>
            <div
                className="border rounded shadow-sm bg-white position-relative premium-card"
                style={{
                    height: CANVAS_HEIGHT,
                    cursor: readOnly ? "default" : "crosshair",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            >
                <canvas ref={canvasRef} />

                {!hasSignature && !readOnly && (
                    <div className="position-absolute top-50 start-50 translate-middle text-muted small">
                        İmzanızı buraya atın
                    </div>
                )}
            </div>

            {!readOnly && (
                <div className="d-flex align-items-center gap-2 mt-2">
                    {hasSaved && (
                        <Badge bg="success" className="shadow-sm">
                            Kaydedildi
                        </Badge>
                    )}

                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="premium-btn-outline"
                        onClick={clearCanvas}
                        disabled={!hasSignature}
                    >
                        Temizle
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        className="premium-btn"
                        onClick={handleSave}
                        disabled={!hasSignature}
                    >
                        Kaydet
                    </Button>
                </div>
            )}
        </div>

    );
}

export default SignatureCanvas;
