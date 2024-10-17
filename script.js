let threadCreated = false;
window.onload = function() {
    const storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
    storedThreads.forEach(threadData => {
        createThreadElement(threadData.title, threadData.content, threadData.votes);
    });
};

function createThread() {
    if (threadCreated) {
        alert("A thread has already been created. You cannot create another one.");
        return;
    }

    const title = document.getElementById('thread-title').value;
    const content = document.getElementById('thread-content').value;

    if (!title || !content) {
        alert("Please fill in both the title and content!");
        return;
    }

    threadCreated = true;

    const threadData = { title, content, votes: { likes: 0, dislikes: 0 }, liked: false, disliked: false };
    saveThread(threadData);
    createThreadElement(title, content, threadData.votes);

    document.getElementById('thread-title').value = '';
    document.getElementById('thread-content').value = '';
}

function saveThread(threadData) {
    const storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
    storedThreads.push(threadData);
    localStorage.setItem('threads', JSON.stringify(storedThreads));
}

function createThreadElement(title, content, votes) {
    const thread = document.createElement('div');
    thread.classList.add('thread');

    const threadTitle = document.createElement('h3');
    threadTitle.innerText = title;

    const threadContent = document.createElement('p');
    threadContent.innerText = content;

    const likeButton = document.createElement('button');
    likeButton.innerText = 'Like';
    likeButton.onclick = function() {
        toggleVote(votes, 'likes', likeButton, 'liked');
    };

    const dislikeButton = document.createElement('button');
    dislikeButton.innerText = 'Dislike';
    dislikeButton.onclick = function() {
        toggleVote(votes, 'dislikes', dislikeButton, 'disliked');
    };

    const replyInput = document.createElement('textarea');
    replyInput.placeholder = 'Add your reply here...';

    const replyButton = document.createElement('button');
    replyButton.innerText = 'Reply';
    replyButton.onclick = function() {
        const replyContent = replyInput.value;
        if (replyContent) {
            addReply(thread, replyContent);
            replyInput.value = ''; 
        } else {
            alert("Please enter a reply!");
        }
    };

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete Thread';
    deleteButton.onclick = function() {
        thread.remove();
        deleteThread(title); 
        threadCreated = false;
    };

    thread.appendChild(threadTitle);
    thread.appendChild(threadContent);
    thread.appendChild(likeButton);
    thread.appendChild(dislikeButton);
    thread.appendChild(replyInput);
    thread.appendChild(replyButton);
    thread.appendChild(deleteButton); 
    updateVoteDisplay(thread, votes);

    document.getElementById('thread-list').appendChild(thread);
}

function toggleVote(votes, type, button, votedType) {
    const wasVoted = button.classList.contains('active');

    if (type === 'likes' && votes.dislikes > 0) {
        votes.dislikes--;
        updateVoteDisplay(button.closest('.thread'), votes);
        button.closest('.thread').querySelector('button[innerText="Dislike"]').classList.remove('active');
    } else if (type === 'dislikes' && votes.likes > 0) {
        votes.likes--;
        updateVoteDisplay(button.closest('.thread'), votes);
        button.closest('.thread').querySelector('button[innerText="Like"]').classList.remove('active');
    }

    if (wasVoted) {
        votes[type]--;
        button.classList.remove('active');
    } else {
        votes[type]++;
        button.classList.add('active');
    }

    updateVoteDisplay(button.closest('.thread'), votes);
    updateLocalStorage(); 
}

function updateVoteDisplay(thread, votes) {
    const voteDisplay = document.createElement('div');
    voteDisplay.innerText = `Likes: ${votes.likes}, Dislikes: ${votes.dislikes}`;
    const existingVoteDisplay = thread.querySelector('.vote-display');
    if (existingVoteDisplay) {
        thread.removeChild(existingVoteDisplay);
    }
    voteDisplay.classList.add('vote-display');
    thread.appendChild(voteDisplay);
}

function addReply(thread, replyContent) {
    const replyList = document.createElement('div');
    replyList.classList.add('reply-list');

    const reply = document.createElement('div');
    reply.classList.add('reply');
    reply.innerText = replyContent;

    replyList.appendChild(reply);
    thread.appendChild(replyList);
}
function deleteThread(title) {
    const storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
    const updatedThreads = storedThreads.filter(thread => thread.title !== title);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
}
function updateLocalStorage() {
    const storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
    const updatedThreads = storedThreads.map(thread => {
        const threadElement = document.querySelector(`.thread h3:contains('${thread.title}')`);
        if (threadElement) {
            const votes = {
                likes: threadElement.closest('.thread').querySelector('button[innerText="Like"]').classList.contains('active') ? thread.votes.likes + 1 : thread.votes.likes,
                dislikes: threadElement.closest('.thread').querySelector('button[innerText="Dislike"]').classList.contains('active') ? thread.votes.dislikes + 1 : thread.votes.dislikes
            };
            return { ...thread, votes }; 
        }
        return thread;
    });
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
}
