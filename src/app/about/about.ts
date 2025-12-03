import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  imports:[CommonModule]
})
export class About {
  features = [
    { icon: '💻', title: 'קודים מוכנים', description: 'קוד מוכן לשימוש בכל השפות הפופולריות – חוסך זמן ומאפשר להתמקד בפרויקטים.' },
    { icon: '📖', title: 'תיעוד והדרכה', description: 'כל קוד מגיע עם הסברים ודוגמאות, כדי שתוכל ללמוד ולהבין את כל המנגנונים.' },
    { icon: '⚡', title: 'עדכונים שוטפים', description: 'אנחנו שומרים על הקודים עדכניים בהתאם לטכנולוגיות החדשות ביותר.' },
    { icon: '🤝', title: 'תמיכה מקצועית', description: 'תמיכה לכל הלקוחות שלנו בכל שאלה ובעיה, עם יחס אישי.' }
  ];

  team = [
    { name: 'מיכאל', role: 'מנהל טכנולוגי', icon: '🧠' },
    { name: 'שרה', role: 'מפתחת תוכנה', icon: '💻' },
    { name: 'דניאל', role: 'מעצב UX/UI', icon: '🎨' },
    { name: 'אייל', role: 'תמיכה ושירות לקוחות', icon: '🎧' }
  ];
  
}
