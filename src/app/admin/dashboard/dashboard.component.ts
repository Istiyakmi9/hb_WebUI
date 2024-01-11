import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/providers/userService';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({transform: 'scale(0.5)'}),
        animate('150ms', style({transform: 'scale(1)'}))
      ]),
      transition('visible => void', [
        style({transform: 'scale(1)'}),
        animate('150ms', style({transform: 'scale(0.5)'}))
      ]),
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({opacity: 1}),
        animate('50ms', style({opacity: 0.8}))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  pages: Array<any> =[{
    Icon: "fa-solid fa-earth-americas",
    Title: "Post reach",
    Detail: "",
    Total: 0
  }, {
    Icon: "fa-solid fa-users",
    Title: "Post engagement",
    Detail: "",
    Total: 0
  }, {
    Icon: "fa-solid fa-thumbs-up",
    Title: "New Page likes",
    Detail: "",
    Total: 0
  }, {
    Icon: "fa-solid fa-bullhorn",
    Title: "Create promotion",
    Detail: "",
    Total: 0
  }];
  posts: Array<any> = [{
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Nikola Tesla inventions constitute numerous technological breakthroughs throughout his lifetime. Born in Smiljan, Croatia, in 1856, the math and physics genius contributed innovations that continue to impact our lives daily today. He held over three hundred patents, but was only recognized for some, indicating many of his ideas were tested and failed or never became well known. In 1882, upon graduation from the Technical University of Graz and Philosophy at the University of Prague, he drew the first sketches of his idea to build an electromagnetic motor. His first job entailed retailing DC power plants for ConEd which led to his immigration to the states in 1884.",
    PostImages: [ {
      imageSrc: "assets/job/01.jpeg",
      imageAlt: '1'
    }]
  }, {
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "The electrical coil named for its inventor is one of Tesla's showiest inventions, and he used it to its full dramatic extent in demonstrations held in his New York City lab. The coil uses polyphase alternating currents -- another of Tesla's discoveries -- to create a transformer capable of producing very high voltages. It brought forth impressive crackling sparks and sheets of electric flame that impressed the electrically savvy and the layman alike. They're primarily used for entertainment today.",
    PostImages: [ {
      imageSrc: "assets/job/01.jpeg",
      imageAlt: '1'
    }, {
      imageSrc: "assets/job/02.jpeg",
      imageAlt: '2'
    }]
  }, {
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Tesla carried detailed plans for this AC motor in his head (a particular talent of his) until he could build a physical model the next year. The alternating current created magnetic poles that reversed themselves without mechanical aid, as DC motors required, and caused an armature (the revolving part of any electromechanical device) to whirl around the motor. This was his rotating magnetic field put into practice as a motor; within two years, he would use it in AC generators and transformers as well.",
    PostImages: [{
      imageSrc: "assets/job/01.jpeg",
      imageAlt: '1'
    }, {
      imageSrc: "assets/job/02.jpeg",
      imageAlt: '2'
    }, {
      imageSrc: "assets/job/03.jpeg",
      imageAlt: '3'
    }]
  }, {
    UserImage: "assets/face.jpg",
    UserName: "Nikola Tesla",
    PostedOn: new Date(),
    PostDetail: "Tesla arrived in New York in 1884 and was hired as an engineer at Thomas Edison’s Manhattan headquarters. He worked there for a year, impressing Edison with his diligence and ingenuity. At one point Edison told Tesla he would pay $50,000 for an improved design for his DC dynamos. After months of experimentation, Tesla presented a solution and asked for the money. Edison demurred, saying, “Tesla, you don’t understand our American humor.” Tesla quit soon after.",
    PostImages: [{
      imageSrc: "assets/job/01.jpeg",
      imageAlt: '1'
    }, {
      imageSrc: "assets/job/02.jpeg",
      imageAlt: '2'
    }, {
      imageSrc: "assets/job/03.jpeg",
      imageAlt: '3'
    }, {
      imageSrc: "assets/job/04.jpeg",
      imageAlt: '4'
    }]
  }];
  userName: string = null;
  placeholder: string = null;
  postMessage: string = null;
  showCount:boolean = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage: Item = this.posts[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  currentImgSlide: Array<any> = [];
  previews: Array<any> = [];

  constructor(private user: UserService) {}

  ngOnInit(): void {
    let currentUser = this.user.getInstance();
    if (currentUser && currentUser.Email) {
      let name = currentUser.Email.split("@");
      this.userName = name[0];
      this.placeholder = `Whats's on your mind, ${this.userName}`;
    }
    this.totalImageCount = this.posts.length;
  }

  onPreviewImage(index: number, img: any): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentImgSlide = img;
    this.currentLightboxImage = this.currentImgSlide[index];
  }

  onAnimationEnd(event: any) {
    if(event.toState === 'void') {
      this.showMask = false;
    }
  }

  onClosePreview() {
    this.previewImage = false;
  }

  next(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.currentImgSlide.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.currentImgSlide[this.currentIndex];
  }

  prev(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.currentIndex = this.currentIndex - 1;
    if(this.currentIndex < 0) {
      this.currentIndex = this.currentImgSlide.length - 1;
    }
    this.currentLightboxImage = this.currentImgSlide[this.currentIndex];
  }

  fireBrowserFile() {
    $("#uploadPost").click();
  }

  uploadMessageImg(event: any) {
    if (event.target.files) {
      let selectedfile = event.target.files;
      for (let i = 0; i < selectedfile.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(selectedfile[i]);
      }
    }
  }

  savePost() {
    if (this.postMessage && this.postMessage != "") {
      let postimg = [];
      if (this.previews.length > 0) {
        for (let i = 0; i < this.previews.length; i++) {
          postimg.push({
            imageSrc: this.previews[i],
            imageAlt: i+1
          })
        }
      }

      this.posts.unshift({
        UserImage: "assets/face.jpg",
        UserName: this.userName,
        PostedOn: new Date(),
        PostDetail: this.postMessage,
        PostImages: postimg
      });

      this.postMessage = "";
      this.previews = [];
    }
  }
}

interface Item {
  imageSrc: string;
  imageAlt: string;
}
