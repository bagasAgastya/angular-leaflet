import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('cardHover', [
      state(
        'hover',
        style({
          transform: 'translateY(-10px)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        })
      ),
      state(
        'normal',
        style({
          transform: 'translateY(0)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        })
      ),
      transition('normal <=> hover', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  title = 'A BIT ABOUT ME';
  subtitle = 'Who Am I?';
  description = `Hi, I'm Bagas Agastya, I'm a passionate coder who thrives on solving complex problems and creating innovative solutions.
                Beyond coding, I have a deep love for football, enjoying both casual games and competitive matches. Music is a significant
                part of my life, offering relaxation and inspiration through a wide range of genres. Additionally, I'm an avid gamer who
                enjoys immersing myself in diverse and challenging virtual worlds.`;
  poweredBy = 'Powered by Bagas Agastya';
  quote =
    'Software and cathedrals are much the same — first we build them, then we pray.';

  interests = [
    { name: 'FOOTBALL', icon: '⚽', loveState: false },
    { name: 'CODER', icon: '💻', loveState: false },
    { name: 'GAMER', icon: '🎮', loveState: false },
    { name: 'MUSIC', icon: '🎧', loveState: false },
  ];

  hoverState = new Array(this.interests.length).fill('normal');

  constructor() {}

  ngOnInit(): void {}

  onClickHeart(interest: { name: string; icon: string; loveState: boolean }) {
    interest.loveState = !interest.loveState;
  }
}
