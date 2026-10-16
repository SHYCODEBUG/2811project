var questions = [
    {
        question: "1. 비밀번호를 안전하게 관리하는 방법은?",
        choices: [
            "모든 사이트에서 같은 비밀번호 사용",
            "사이트마다 다른 비밀번호 사용",
            "친구와 비밀번호 공유",
            "생일만으로 비밀번호 만들기"
        ],
        answer: 1,
        explanation: "사이트마다 서로 다른 비밀번호를 사용하는 것이 안전합니다."
    },
    {
        question: "2. 의심스러운 이메일 링크를 받았다면?",
        choices: [
            "바로 누른다",
            "친구에게 전달한다",
            "출처를 확인하고 의심스러우면 열지 않는다",
            "첨부파일부터 실행한다"
        ],
        answer: 2,
        explanation: "의심스러운 링크는 피싱 사이트로 연결될 수 있습니다."
    },
    {
        question: "3. 공용 컴퓨터 사용 후 해야 할 일은?",
        choices: [
            "로그인 상태로 둔다",
            "비밀번호를 저장한다",
            "브라우저를 그대로 둔다",
            "로그아웃한다"
        ],
        answer: 3,
        explanation: "공용 컴퓨터에서는 사용 후 로그아웃해야 합니다."
    },
    {
        question: "4. 2단계 인증의 목적은?",
        choices: [
            "추가 확인으로 계정 보호를 강화한다",
            "인터넷 속도를 높인다",
            "비밀번호를 공개한다",
            "광고를 차단한다"
        ],
        answer: 0,
        explanation: "2단계 인증은 계정 보안을 강화하는 데 도움이 됩니다."
    },
    {
        question: "5. 소프트웨어를 업데이트하는 이유는?",
        choices: [
            "이름을 바꾸기 위해",
            "보안 취약점을 수정하기 위해",
            "비밀번호를 공유하기 위해",
            "인터넷을 끄기 위해"
        ],
        answer: 1,
        explanation: "업데이트에는 보안 취약점 수정이 포함될 수 있습니다."
    }
];

// 화면 요소 찾아두기
var choiceBtns = document.querySelectorAll(".choice");
var choiceBox = document.querySelector(".choices");
var nextBtn = document.querySelector(".primary");
var actionBox = document.querySelector(".actions");

// 상태 변수
var order = [];        // 이번에 풀 문제 번호들
var currentQuestion = 0;
var score = 0;
var answered = false;
var finished = false;
var isReview = false;  // 복습 중인지
var wrongList = [];    // 틀린 문제 번호들
var reviewBtn = null;
var quizReady = false;

function showQuestion() {
    var qIndex = order[currentQuestion];
    var q = questions[qIndex];

    document.querySelector("#question").textContent = q.question;

    if (isReview) {
        document.querySelector("#question-number").textContent =
            "복습 문제 " + (currentQuestion + 1) + " / " + order.length;
    } else {
        document.querySelector("#question-number").textContent =
            "문제 " + (currentQuestion + 1) + " / " + order.length;
    }

    document.querySelector("#score-label").textContent = "현재 점수: " + score + "점";
    document.querySelector("#feedback").textContent = "보기를 선택하세요.";
    document.querySelector("#result").textContent = "퀴즈를 모두 풀면 결과가 표시됩니다.";

    for (var i = 0; i < 4; i++) {
        choiceBtns[i].textContent = q.choices[i];
        choiceBtns[i].disabled = false;
        choiceBtns[i].className = "choice";
    }

    answered = false;
}

function Brightnesscontrol() {
    document.body.classList.toggle("dark");
    var btn = document.querySelector(".Brightenss");
    btn.textContent = document.body.classList.contains("dark") ? "라이트모드" : "다크모드";
}

function selectAnswer(num) {
    if (quizReady == false) {
        return;
    }
    if (answered == true || finished == true) {
        return;
    }

    var qIndex = order[currentQuestion];
    var q = questions[qIndex];

    if (num == q.answer) {
        score = score + 1;
        document.querySelector("#feedback").textContent = "정답입니다! " + q.explanation;
    } else {
        document.querySelector("#feedback").textContent = "오답입니다. " + q.explanation;

        // 이미 저장된 문제인지 확인하고 없으면 추가
        var already = false;
        for (var j = 0; j < wrongList.length; j++) {
            if (wrongList[j] == qIndex) {
                already = true;
            }
        }
        if (already == false) {
            wrongList.push(qIndex);
        }
    }

    // 정답은 초록색, 내가 고른 틀린 답은 빨간색
    choiceBtns[q.answer].className = "choice correct";
    if (num != q.answer) {
        choiceBtns[num].className = "choice wrong";
    }

    for (var i = 0; i < 4; i++) {
        choiceBtns[i].disabled = true;
    }

    document.querySelector("#score-label").textContent = "현재 점수: " + score + "점";
    answered = true;
}

function nextQuestion() {
    if (quizReady == false || finished == true) {
        return;
    }

    if (answered == false) {
        document.querySelector("#feedback").textContent = "먼저 보기 하나를 선택하세요.";
        return;
    }

    if (currentQuestion < order.length - 1) {
        currentQuestion = currentQuestion + 1;
        showQuestion();
    } else {
        showResult();
    }
}

function makeReviewButton() {
    if (reviewBtn != null) {
        reviewBtn.remove();
    }

    reviewBtn = document.createElement("button");
    reviewBtn.className = "primary";
    reviewBtn.textContent = "틀린 문제 다시 보기 (" + wrongList.length + "문제)";
    reviewBtn.onclick = function () {
        startQuiz(wrongList, true);
    };

    actionBox.insertBefore(reviewBtn, actionBox.firstChild);
}

function showResult() {
    finished = true;

    var total = order.length;
    var percent = Math.round(score * 100 / total);
    var message = "";

    if (percent >= 80) {
        message = "훌륭합니다! 보안 지식이 탄탄합니다.";
    } else if (percent >= 60) {
        message = "좋습니다! 틀린 문제를 복습해 보세요.";
    } else {
        message = "해설을 읽고 보안 지식을 복습해 보세요.";
    }

    choiceBox.style.display = "none";
    nextBtn.style.display = "none";

    if (isReview) {
        document.querySelector("#question").textContent = "복습 완료!";
        document.querySelector("#question-number").textContent = "복습 완료";
        document.querySelector("#result").textContent =
            "복습 결과: " + score + " / " + total + "점 (" + percent + "%). " + message;
    } else {
        document.querySelector("#question").textContent = "퀴즈 완료!";
        document.querySelector("#question-number").textContent = "전체 문제 완료";
        document.querySelector("#result").textContent =
            "최종 점수: " + score + " / " + total + "점 (" + percent + "%). " + message;
    }

    document.querySelector("#feedback").textContent = "참여해 줘서 감사합니다.";

    if (wrongList.length > 0) {
        makeReviewButton();
    }
}

function startQuiz(list, review) {
    if (quizReady == false) {
        return;
    }

    // 목록을 복사해서 사용 (wrongList가 바뀌어도 영향 없게)
    order = [];
    for (var i = 0; i < list.length; i++) {
        order.push(list[i]);
    }

    currentQuestion = 0;
    score = 0;
    answered = false;
    finished = false;
    isReview = review;
    wrongList = [];

    if (reviewBtn != null) {
        reviewBtn.remove();
        reviewBtn = null;
    }

    choiceBox.style.display = "";
    nextBtn.style.display = "";

    showQuestion();
}

function restartQuiz() {
    var all = [];
    for (var i = 0; i < questions.length; i++) {
        all.push(i);
    }
    startQuiz(all, false);
}

function checkQuestions() {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].choices.length != 4) {
            document.querySelector("#question").textContent = "문제 데이터에 오류가 있습니다.";
            document.querySelector("#feedback").textContent =
                (i + 1) + "번 문제의 보기 개수를 확인하세요.";
            return false;
        }
        if (questions[i].answer < 0 || questions[i].answer > 3) {
            document.querySelector("#question").textContent = "문제 데이터에 오류가 있습니다.";
            document.querySelector("#feedback").textContent =
                (i + 1) + "번 문제의 정답 번호를 확인하세요.";
            return false;
        }
    }
    return true;
}

// 시작
quizReady = checkQuestions();

if (quizReady) {
    restartQuiz();
} else {
    for (var i = 0; i < 4; i++) {
        choiceBtns[i].disabled = true;
    }
}