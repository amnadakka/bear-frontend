import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bear } from '../../models/bear.interface';
import { BearService } from '../../services/bear.service';
import { Subscription, interval } from 'rxjs';

interface MovingBear extends Bear {
  x: number;
  y: number;
  vx: number;
  vy: number;
  clicked: boolean;
}

@Component({
  selector: 'app-moving-bears-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moving-bears-game.component.html',
  styleUrls: ['./moving-bears-game.component.scss']
})
export class MovingBearsGameComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private animationId: number | null = null;
  
  // Game state
  public gameState = signal<'waiting' | 'playing' | 'won' | 'lost'>('waiting');
  public timeLeft = signal(30);
  public currentClickIndex = signal(0);
  public movingBears = signal<MovingBear[]>([]);
  public gameMessage = signal('');
  
  // Computed values
  public sortedBears = computed(() => {
    return [...this.movingBears()].sort((a, b) => a.id - b.id);
  });
  
  public gameContainerStyle = computed(() => ({
    position: 'relative',
    width: '100%',
    height: '400px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  }));

  constructor(private bearService: BearService) {
    // Effect to handle game over when time runs out
    effect(() => {
      if (this.timeLeft() <= 0 && this.gameState() === 'playing') {
        this.endGame('lost', 'Time ran out!');
      }
    });
  }

  ngOnInit(): void {
    this.loadBears();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.subscription.unsubscribe();
  }

  private loadBears(): void {
    console.log('Loading bears...');
    this.subscription.add(
      this.bearService.loadBears().subscribe({
        next: (bears) => {
          console.log('Bears loaded:', bears.length, bears);
          this.initializeMovingBears(bears);
        },
        error: (error) => {
          console.error('Failed to load bears:', error);
          console.log('Using mock data instead...');
          // Use mock data if backend is not available
          const mockBears: Bear[] = [
            { id: 1, name: 'Teddy', size: 10, colors: [{ id: 1, name: 'Brown', hexa: '#8B4513' }] },
            { id: 2, name: 'Polar', size: 15, colors: [{ id: 2, name: 'White', hexa: '#FFFFFF' }] },
            { id: 3, name: 'Grizzly', size: 20, colors: [{ id: 3, name: 'Dark Brown', hexa: '#654321' }] },
            { id: 4, name: 'Panda', size: 12, colors: [{ id: 4, name: 'Black', hexa: '#000000' }, { id: 2, name: 'White', hexa: '#FFFFFF' }] }
          ];
          this.initializeMovingBears(mockBears);
        }
      })
    );
  }

  private initializeMovingBears(bears: Bear[]): void {
    console.log('Initializing moving bears...');
    const movingBears: MovingBear[] = bears.map(bear => ({
      ...bear,
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 80 + 10, // 10% to 90% of container height
      vx: (Math.random() - 0.5) * 2, // Random velocity between -1 and 1
      vy: (Math.random() - 0.5) * 2,
      clicked: false
    }));
    
    console.log('Moving bears initialized:', movingBears);
    this.movingBears.set(movingBears);
  }

  public startGame(): void {
    console.log('Starting game...');
    if (this.movingBears().length === 0) {
      this.gameMessage.set('No bears available to play with.');
      return;
    }

    console.log('Bears available:', this.movingBears().length);
    this.gameState.set('playing');
    this.timeLeft.set(30);
    this.currentClickIndex.set(0);
    this.gameMessage.set('');
    
    // Reset all bears
    this.movingBears.update(bears => 
      bears.map(bear => ({ ...bear, clicked: false }))
    );
    
    console.log('Game state set to playing, bears reset');
    
    // Start timer
    this.subscription.add(
      interval(1000).subscribe(() => {
        if (this.gameState() === 'playing') {
          this.timeLeft.update(time => time - 1);
        }
      })
    );
    
    // Start movement animation
    this.startMovementAnimation();
  }

  private startMovementAnimation(): void {
    const animate = () => {
      if (this.gameState() === 'playing') {
        this.movingBears.update(bears => 
          bears.map(bear => {
            if (bear.clicked) return bear;
            
            // Update position
            let newX = bear.x + bear.vx;
            let newY = bear.y + bear.vy;
            let newVx = bear.vx;
            let newVy = bear.vy;
            
            // Bounce off walls
            if (newX <= 5 || newX >= 95) {
              newVx = -bear.vx;
              newX = Math.max(5, Math.min(95, newX));
            }
            if (newY <= 5 || newY >= 95) {
              newVy = -bear.vy;
              newY = Math.max(5, Math.min(95, newY));
            }
            
            return { ...bear, x: newX, y: newY, vx: newVx, vy: newVy };
          })
        );
        
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  public onBearClick(bear: MovingBear): void {
    console.log('Bear clicked:', bear.id, 'Game state:', this.gameState(), 'Clicked:', bear.clicked);
    
    if (this.gameState() !== 'playing' || bear.clicked) {
      console.log('Click ignored - game not playing or bear already clicked');
      return;
    }

    const sortedBears = this.sortedBears();
    const expectedBear = sortedBears[this.currentClickIndex()];
    
    console.log('Expected bear:', expectedBear?.id, 'Current index:', this.currentClickIndex());
    
    if (bear.id === expectedBear.id) {
      // Correct order
      console.log('Correct order! Marking bear as clicked');
      this.movingBears.update(bears => 
        bears.map(b => b.id === bear.id ? { ...b, clicked: true } : b)
      );
      
      this.currentClickIndex.update(index => index + 1);
      
      // Check if all bears have been clicked
      if (this.currentClickIndex() >= sortedBears.length) {
        this.endGame('won', 'Congratulations! You clicked all bears in the correct order!');
      }
    } else {
      // Wrong order
      this.endGame('lost', `Wrong order! You clicked bear ${bear.id} but should have clicked bear ${expectedBear.id}.`);
    }
  }

  public onContainerClick(event: MouseEvent): void {
    console.log('Container clicked at:', event.clientX, event.clientY);
  }

  private endGame(result: 'won' | 'lost', message: string): void {
    console.log('Game ended:', result, message);
    this.gameState.set(result);
    this.gameMessage.set(message);
    
    // Stop the animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Clear subscriptions
    this.subscription.unsubscribe();
  }

  public restartGame(): void {
    this.gameState.set('waiting');
    this.gameMessage.set('');
    this.loadBears();
  }

  public getBearStyle(bear: MovingBear): any {
    return {
      position: 'absolute',
      left: `${bear.x}%`,
      top: `${bear.y}%`,
      transform: 'translate(-50%, -50%)',
      cursor: bear.clicked ? 'default' : 'pointer',
      opacity: bear.clicked ? 0.3 : 1,
      transition: 'opacity 0.3s ease'
    };
  }
}
