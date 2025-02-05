class FogParticle {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.xVelocity = (Math.random() - 0.5) * 1;
        this.yVelocity = (Math.random() - 0.5) * 1;
        this.image = null;
    }

    setImage(image) {
        this.image = image;
    }

    render() {
        if (!this.image) return;

        this.ctx.drawImage(
            this.image,
            this.x - this.image.width / 2,
            this.y - this.image.height / 2,
            400,
            400
        );

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Handle boundary collisions
        if (this.x >= this.canvasWidth || this.x <= 0) {
            this.xVelocity = -this.xVelocity;
            this.x = Math.max(0, Math.min(this.x, this.canvasWidth));
        }

        if (this.y >= this.canvasHeight || this.y <= 0) {
            this.yVelocity = -this.yVelocity;
            this.y = Math.max(0, Math.min(this.y, this.canvasHeight));
        }
    }
}

class Fog {
    constructor({ selector, density = 50, velocity = 1, particle }) {
        this.canvas = document.querySelector(selector);
        this.ctx = this.canvas.getContext('2d');

        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());

        this.particleCount = density;
        this.maxVelocity = velocity;
        this.particleSrc = particle;

        this._createParticles();
        this._setImage();
        this._render();
    }

    _resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    }

    _createParticles() {
        this.particles = [];
        const random = (min, max) => Math.random() * (max - min) + min;

        for (let i = 0; i < this.particleCount; i++) {
            const particle = new FogParticle(this.ctx, this.canvasWidth, this.canvasHeight);
            particle.setImage(this.image);
            particle.x = random(0, this.canvasWidth);
            particle.y = random(0, this.canvasHeight);
            this.particles.push(particle);
        }
    }

    _setImage() {
        const img = new Image();
        img.onload = () => this.particles.forEach(p => p.setImage(img));
        img.src = this.particleSrc;
    }

    _render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.particles.forEach(p => p.render());
        requestAnimationFrame(() => this._render());
    }
}

new Fog({
    selector: '#fog',
    particle: 'https://maciekmaciej.github.io/assets/fog-particle.png',
    density: 50,
    velocity: 1
});


document.addEventListener("DOMContentLoaded", function () {
    const title = document.getElementById("title");
    const container = document.getElementById("container");

    title.addEventListener("click", function () {
        title.classList.add("fade-out");

        setTimeout(() => {
            title.style.display = "none";  
            container.style.display = "flex";  
            setTimeout(() => {
                container.style.opacity = "1"; 
            }, 100);
        }, 1000);
    });
});

document.getElementById("button").addEventListener("click", function () {
    window.location.href = "https://newart.city/show/the-portals";
});





