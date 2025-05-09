// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleRadius = 50; // 圓的半徑
let trails = []; // 用於存儲圓心的軌跡
let isDragging = false; // 是否正在拖動圓
let lastX, lastY; // 上一次圓心的位置

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 圓的初始位置設置為視窗中心
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 畫出已經畫出的軌跡
  for (let trail of trails) {
    stroke(trail.color); // 設置線條顏色
    strokeWeight(6);
    line(trail.x1, trail.y1, trail.x2, trail.y2);
  }

  // 畫出圓
  fill(0, 255, 0, 150); // 綠色半透明
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let isCircleMoved = false; // 檢查是否有手在移動圓

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取食指和大拇指的座標
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // 計算食指和大拇指與圓心的距離
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        // 如果食指和大拇指同時碰觸到圓的邊緣，讓圓跟隨移動
        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 設置圓心為兩點的中點
          let newX = (indexFinger.x + thumb.x) / 2;
          let newY = (indexFinger.y + thumb.y) / 2;

          // 畫出軌跡
          if (isDragging) {
            let color = hand.handedness === "Left" ? [255, 0, 0] : [0, 0, 255]; // 紅色(左手)或藍色(右手)
            trails.push({ x1: lastX, y1: lastY, x2: newX, y2: newY, color });
          }

          // 更新圓心位置
          circleX = newX;
          circleY = newY;

          // 記錄當前圓心位置
          lastX = circleX;
          lastY = circleY;

          isDragging = true;
          isCircleMoved = true;
        }

        // 繪製食指和大拇指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);
        circle(thumb.x, thumb.y, 16);

        // 繪製手部的 keypoints
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          
          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 串接 keypoints 的線條
        stroke('#FFBFFF'); // 粉色線條
        strokeWeight(6);

        // Connect keypoints 0 to 4
        for (let i = 0; i < 4; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 5 to 8
        for (let i = 5; i < 8; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 9 to 12
        for (let i = 9; i < 12; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 13 to 16
        for (let i = 13; i < 16; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 17 to 20
        for (let i = 17; i < 20; i++) {
          line(
            hand.keypoints[i].x, hand.keypoints[i].y,
            hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
          );
        }
      }
    }

    // 如果沒有手在移動圓，停止繪製軌跡
    if (!isCircleMoved) {
      isDragging = false;
    }
  } else {
    // 如果沒有檢測到手，停止繪製軌跡
    isDragging = false;
  }
}
