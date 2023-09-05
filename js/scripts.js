window.onload = () => {
    resizingProductImages();
    managingReadMoreButton();
    managingNavSpace();
    settingWorkingStatus()
};

window.onresize = () => {
    resizingProductImages();
    managingReadMoreButton();
    try {
        setPopUp();
    } catch {
        // Pass
    }
};

function findNextWorkingDay(days, week_day) {
    let day_to_test, next_working_day, working_status;
    for (let i = 1; i <= 7; i++) {
        // Se não acabou a semana
        if (i + week_day < days.length) {
            day_to_test = week_day + i;
            next_working_day = days[day_to_test];
        } else {
            //Se acabou a semana
            day_to_test = (week_day + i) - days.length;
            next_working_day = days[day_to_test];
        }
        if (next_working_day.opening_hours != '') {
            break;
        }
    }
    if (next_working_day.opening_hours != '') {
        next_opening = next_working_day.opening_hours.split('-')[0]
        working_status = 'Fechado, abriremos novamente ' + next_working_day.day + ' às ' + next_opening + '.';
    } else {
        working_status = 'Estamos temporáriamente fechados.';
    }
    return working_status
};

function settingWorkingStatus() {
    let days = [
        {'day': 'domingo',       'opening_hours': ''},
        {'day': 'segunda-feira', 'opening_hours': '08:00-18:00'},
        {'day': 'terça-feira',   'opening_hours': '08:00-18:00'},
        {'day': 'quarta-feira',  'opening_hours': '08:00-18:00'},
        {'day': 'quinta-feira',  'opening_hours': '08:00-18:00'},
        {'day': 'sexta-feira',   'opening_hours': '08:00-18:00'},
        {'day': 'sábado',        'opening_hours': '08:00-12:00'}
    ];

    let date     = new Date;
    let week_day = date.getDay();
    let day      = date.getDate();
    let mouth    = date.getMonth(); // +1
    let hours    = String(date.getHours());
    let minutes  = String(date.getMinutes());

    minutes.length == 1 ? minutes = '0' + minutes : '';

    let time = parseInt(hours + minutes);
    let today = days[week_day];
    let opening_hours, open_time, close_time;
    let working_status = '';
    
    if (today.opening_hours == '') {
        working_status = findNextWorkingDay(days, week_day);
    } else {
        opening_hours = today.opening_hours.split('-');
        [open_time, close_time] = opening_hours.map((time) => {return parseInt(time.replace(':', ''))});

        if (time < open_time) {
            working_status = 'Fechado, abrirá hoje às ' + opening_hours[0] + '.';
        } else if (time >= open_time && time < close_time) {
            working_status = 'Aberto hoje até às ' + opening_hours[1] + '.';
        } else if (time >= close_time) {
            working_status = findNextWorkingDay(days, week_day);
        }
    }
    document.getElementById('working-status').innerHTML = working_status;
    // adicionar feriados
};

const nav_toggler = document.getElementById('nav-toggler');
nav_toggler.addEventListener('click', () => {
    let line_1 = document.getElementById('line-1').classList;
    let line_2 = document.getElementById('line-2').classList;
    let line_3 = document.getElementById('line-3').classList;
    let collapse_navbar_class_list = document.getElementById('collapse-navbar').classList;
    
    collapse_navbar_class_list.toggle('show');
    line_1.toggle('rotate-45');
    line_2.toggle('become-white');
    line_3.toggle('rotate-minus-45');
});

function managingNavSpace() {
    let navbar_height = document.getElementById('navbar').clientHeight;
    let banner = document.getElementById('banner');
    let collapse_navbar = document.getElementById('collapse-navbar');
    let content_blocks = Array.from(document.getElementsByClassName('content-block'));

    banner.setAttribute('style', 'margin-top:' + navbar_height + 'px;');
    collapse_navbar.setAttribute('style', 'margin-top:' + navbar_height + 'px;');

    content_blocks.forEach((content_block) => {
        content_block.setAttribute('style', 'padding-top: ' + (navbar_height + 25) + 'px;');
    });
};

function zoomIn(img) {
    let img_width = img.clientWidth;
    let frame_width = img.parentElement.clientWidth;
    let difference_percent = ((frame_width - img_width) / img_width) + 1;
    img.style.transform = 'scale(' + difference_percent + ')';
};

function zoomOut(img) {
    img.style.transform = "scale(1)";
};

function resizingProductImages() {
    let elements = Array.from(document.getElementsByClassName('product-img'));

    elements.forEach((element) => {
        element.setAttribute('style', 'height:' + element.clientWidth + 'px;');
        // TIRAR
        element.setAttribute('onmouseover', 'zoomIn(this)');
        element.setAttribute('onmouseout', 'zoomOut(this)');
    });
};

function openPopUp(element, video_link = "") {
    let pop_up_area = document.getElementById('pop-up-area');

    // Criação de tela
    let screen = '<div id="screen" onclick="closePopUp()"></div>';

    // Criação do botão de fechar pop-up
    let close_button = 
        '<div id="close-button" onclick="closePopUp()">' +
            '<div class="line rotate-45"></div>' +
            '<div class="line become-white"></div>' +
            '<div class="line rotate-minus-45"></div>' +
        '</div>'
    ;
    
    // Criação do exibidor de midia
    let pop_up_media;
    if (video_link == "") {
        pop_up_media = '<img src="' + element.src + '" onload="setPopUp()" id="pop-up-media">';
    } else {
        pop_up_media =
            '<video id="pop-up-media" src="' + video_link + '" width="fit-content" height="fit-content" controls autoplay onresize="setPopUp()" onplay="setPopUp()">' +
                'Erro ao carregar o vídeo' +
            '</video>'
        ;
    }

    // Criação do Pop-up
    let pop_up =
        '<div id="pop-up">' +
            '<div id="pop-up-frame">' +
                pop_up_media +
            '</div>' +
        '</div>'
    ;

    // Adição da elementos
    pop_up_area.innerHTML = screen + close_button + pop_up;
};

function setPopUp() {
    let screen = document.documentElement;
    let screen_width = screen.clientWidth;
    let screen_height = screen.clientHeight;

    let pop_up_media = document.getElementById('pop-up-media');

    let pop_up = document.getElementById('pop-up');
    let pop_up_padding = document.defaultView.getComputedStyle(pop_up).getPropertyValue('padding').replace('px', '') * 2;
    let pop_up_width = pop_up.clientWidth;
    let pop_up_height = pop_up.clientHeight;
    
    let close_button = document.getElementById('close-button');
    let close_button_width = close_button.clientWidth;
    let close_button_height = close_button.clientHeight;

    // Pegar distancia entre as bordas da janela
    let limit_distance_h = screen_width - pop_up_width;
    let limit_distance_v = screen_height - pop_up_height;
    
    let attribute_to_change = '';
    let new_measure = 0;
    if (limit_distance_h <= limit_distance_v) {
        attribute_to_change = 'width';
        let max_width = 0;
        if (screen_width < 768 - 17) {
            max_width = screen_width;
        } else {
            max_width = screen_width * 0.9;
        }
        new_measure = max_width - (pop_up_padding + (close_button_width * 2));
    } else {
        attribute_to_change = 'height';
        let max_height = 0;
        if (screen_width > 768 - 17) {
            max_height = screen_height * 0.7;
        } else {
            max_height = screen_height * 0.9;
        }
        new_measure = screen_height - (pop_up_padding + (close_button_height * 2));
    }
    
    pop_up_media.setAttribute('style', attribute_to_change + ': ' + new_measure + 'px;');

    pop_up_width = pop_up.clientHeight;
    pop_up_height = pop_up.clientWidth;

    // TESTAR SEM ATUALIZAÇÃO DPS
    let pop_up_margin_top = (screen_height - pop_up_width) / 2;
    let pop_up_margin_left = (screen_width - pop_up_height) / 2 - 1;
    pop_up.setAttribute(
        'style',
        'margin-top: ' + pop_up_margin_top + 'px; ' +
        'margin-left: ' + pop_up_margin_left + 'px;'
    );

    pop_up_width = document.getElementById('pop-up').clientWidth;


    let close_button_margin_top = pop_up_margin_top - (close_button_height / 2);
    let close_button_margin_left = pop_up_width  + pop_up_margin_left - (close_button_width / 2);

    close_button.setAttribute(
        'style',
            'margin-top: ' + close_button_margin_top + 'px;' +
            'margin-left: ' + close_button_margin_left + 'px;'
    );
};

function closePopUp() {
    let pop_up_area = document.getElementById('pop-up-area');
    pop_up_area.innerHTML = '';
};

function managingReadMoreButton() {
    let descriptions = Array.from(document.getElementsByClassName('product-description'));
    
    descriptions.forEach((description) => {
        let parent_element = description.parentElement;

        // Atribui à descrição seu tamanho natural
        description.setAttribute('style', 'height: fit-content;');

        //Remove botão se já existente
        try {
            parent_element.getElementsByClassName('read-more-button')[0].remove();
        } catch {
            // Pass
        }
        
        let description_height = description.clientHeight;
        let img_height = parent_element.getElementsByClassName('frame')[0].clientHeight;
        
        if (description_height > img_height) {
            // Limita altura da descrição a altura da imagem
            description.setAttribute('style', 'height: ' + img_height + 'px;');

            let span = document.createElement('span');
            span.innerHTML = 'Leia mais';

            let img = document.createElement('img');
            img.setAttribute('src', '/media/img/icons/arrow-down-icon.png');

            let readMoreButton = document.createElement('div');
            readMoreButton.setAttribute('class', 'read-more-button');
            readMoreButton.setAttribute('onclick', 'changeDescriptionDisplay(this)');

            let white_shadow = document.createElement('div');
            white_shadow.setAttribute('class', 'white-shadow');

            let button_content = document.createElement('div');
            button_content.setAttribute('class', 'read-more-button-content');

            button_content.appendChild(span);
            button_content.appendChild(img);
            readMoreButton.appendChild(white_shadow);
            readMoreButton.appendChild(button_content);
            parent_element.appendChild(readMoreButton);
        }
    });
};

function changeDescriptionDisplay(button) {
    let parent_element = button.parentElement;
    if (button.getElementsByTagName('span')[0].innerHTML == 'Leia mais') {
        button.children[0].classList.toggle("white-shadow");
        parent_element.getElementsByClassName('product-description')[0].setAttribute('style', 'height: fit-content;')
        button.getElementsByTagName('span')[0].innerHTML = 'Leia menos';
        button.getElementsByTagName('img')[0].setAttribute('src', '/media/img/icons/arrow-up-icon.png');
    } else {
        let img_height = parent_element.getElementsByClassName('frame')[0].clientHeight;
        parent_element.getElementsByClassName('product-description')[0].setAttribute('style', 'height: ' + img_height + 'px;');
        button.children[0].classList.toggle("white-shadow");
        button.getElementsByTagName('span')[0].innerHTML = 'Leia mais';
        button.getElementsByTagName('img')[0].setAttribute('src', '/media/img/icons/arrow-down-icon.png');
    }
};
