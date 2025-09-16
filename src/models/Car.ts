export class Car {
  model: string;
  brand: string;
  color: string;
  year: number;
  speed: number;
  started: boolean;
  position: number;

  constructor(
    model: string,
    brand: string,
    color: string,
    year: number,
    speed: number
  ) {
    this.model = model;
    this.brand = brand;
    this.color = color;
    this.year = year;
    this.speed = speed;
    this.started = false;
    this.position = 0;
  }

  start(): void {
    this.started = true;
  }

  stop(): void {
    this.started = false;
  }

  accelerate(): void {
    if (this.started) {
      this.position += this.speed;
    }
  }

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.year})`;
  }
}