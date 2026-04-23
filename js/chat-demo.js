var DEMO_MESSAGES = [
  { id:1, speaker:"黛玉", avatar:"daiyu", text:"偷来梨蕊三分白，借得梅花一缕魂。诸位觉得如何？", delay:800 },
  { id:2, speaker:"宝玉", avatar:"baoyu", text:"好诗！只是这一句，比我昨天写的强十倍不止。", delay:2500 },
  { id:3, speaker:"探春", avatar:"tanchun", text:"二哥哥你昨天那首根本不能叫诗", delay:4200 },
  { id:4, speaker:"湘云", avatar:"xiangyun", text:"哈哈哈哈我也觉得！罚他三杯！", delay:5500 },
  { id:5, type:"typing", speaker:"顾砚之", avatar:"guyanzhi", delay:7000 }
];

var AVATAR_CONFIG = {
  daiyu: "assets/avatars/daiyu.png",
  baoyu: "assets/avatars/baoyu.png",
  tanchun: "assets/avatars/tanchun.png",
  xiangyun: "assets/avatars/xiangyun.png",
  guyanzhi: "assets/avatars/guyanzhi.png"
};

function createMsg(msg) {
  var div = document.createElement("div");
  div.className = "msg msg-left";

  var src = AVATAR_CONFIG[msg.avatar] || "";
  var img = src ? '<img src="' + src + '" alt="' + msg.speaker + '" class="msg-avatar">' : '';

  if (msg.type === "typing") {
    div.innerHTML = img +
      '<div class="msg-content">' +
        '<span class="name">' + msg.speaker + '</span>' +
        '<p class="typing-text"><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>' +
      '</div>';
    div.classList.add("typing");
  } else {
    div.innerHTML = img +
      '<div class="msg-content">' +
        '<span class="name">' + msg.speaker + '</span>' +
        '<p>' + msg.text + '</p>' +
      '</div>';
  }

  return div;
}

function initChatDemo() {
  var phoneBody = document.querySelector(".phone-body");
  if (!phoneBody) return;

  function play() {
    phoneBody.innerHTML = "";
    DEMO_MESSAGES.forEach(function(msg) {
      setTimeout(function() {
        phoneBody.appendChild(createMsg(msg));
        phoneBody.scrollTop = phoneBody.scrollHeight;
      }, msg.delay);
    });
  }

  play();
  var total = DEMO_MESSAGES[DEMO_MESSAGES.length - 1].delay + 4000;
  setInterval(play, total);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatDemo);
} else {
  initChatDemo();
}

/* ===== Persona Demo ===== */
var PERSONA_DEMO = {
  qingke: {
    label: "清客", userMsg: "这首诗写得如何？",
    replies: [
      { speaker: "宝玉", avatar: "baoyu", text: "兄台好品味，来，喝一杯再聊。" },
      { speaker: "黛玉", avatar: "daiyu", text: "清客也懂诗？倒是少见。" }
    ]
  },
  wenren: {
    label: "文人", userMsg: "这首诗写得如何？",
    replies: [
      { speaker: "宝玉", avatar: "baoyu", text: "阁下也懂诗？且坐，容我请教一二。" },
      { speaker: "黛玉", avatar: "daiyu", text: "难得遇见同道，你觉得后两句该怎么改？" }
    ]
  }
};

function initPersonaDemo() {
  var tabs = document.querySelectorAll(".persona-tab");
  var chatArea = document.getElementById("personaChatArea");
  if (!tabs.length || !chatArea) return;

  var current = "qingke";

  function render(key) {
    var data = PERSONA_DEMO[key];
    chatArea.classList.add("fade-out");
    setTimeout(function() {
      var html = '<div class="persona-msg-user"><div class="bubble">' + data.userMsg + '</div></div>';
      data.replies.forEach(function(r) {
        var src = AVATAR_CONFIG[r.avatar] || "";
        html += '<div class="persona-msg-ai">' +
          (src ? '<img src="' + src + '" alt="' + r.speaker + '" class="msg-avatar">' : '') +
          '<div><div class="speaker-name">' + r.speaker + '</div><div class="bubble">' + r.text + '</div></div></div>';
      });
      chatArea.innerHTML = html;
      chatArea.classList.remove("fade-out");
      chatArea.classList.add("fade-in");
    }, 300);
  }

  tabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
      var key = tab.dataset.persona;
      if (key === current) return;
      current = key;
      tabs.forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");
      render(key);
    });
  });

  render("qingke");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPersonaDemo);
} else {
  initPersonaDemo();
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  var els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  els.forEach(function(el) { observer.observe(el); });
}

function initTypewriter() {
  var el = document.querySelector(".typewriter-line");
  if (!el) return;
  var fullText = el.dataset.text;
  el.textContent = "";
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var i = 0;
        var iv = setInterval(function() {
          if (i < fullText.length) { el.textContent += fullText[i]; i++; } else { clearInterval(iv); }
        }, 80);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(el);
}

document.addEventListener("DOMContentLoaded", function() { initScrollReveal(); initTypewriter(); });

/* ===== Ink Particles ===== */
function initInkParticles() {
  var canvas = document.getElementById("inkCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var width, height, particles, mouseX = -1000, mouseY = -1000;

  function resize() { width = canvas.width = canvas.parentElement.offsetWidth; height = canvas.height = canvas.parentElement.offsetHeight; }
  function createParticles() {
    var count = Math.floor((width * height) / 12000); particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({ x:Math.random()*width, y:Math.random()*height, r:Math.random()*3+1, dx:(Math.random()-0.5)*0.3, dy:(Math.random()-0.5)*0.2, opacity:Math.random()*0.3+0.05 });
    }
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    particles.forEach(function(p) {
      var dx=p.x-mouseX, dy=p.y-mouseY, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){var f=(120-dist)/120; p.x+=dx*f*0.02; p.y+=dy*f*0.02;}
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<-10)p.x=width+10; if(p.x>width+10)p.x=-10;
      if(p.y<-10)p.y=height+10; if(p.y>height+10)p.y=-10;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle="rgba(200,195,180,"+p.opacity+")"; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  canvas.parentElement.addEventListener("mousemove",function(e){var r=canvas.parentElement.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;});
  canvas.parentElement.addEventListener("mouseleave",function(){mouseX=-1000;mouseY=-1000;});
  window.addEventListener("resize",function(){resize();createParticles();});
  resize(); createParticles(); draw();
}
document.addEventListener("DOMContentLoaded", initInkParticles);