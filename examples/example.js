
class telephoneMask {

    static getInputNumbersValue(input) {
        return input.value.replace(/\D/g, '');
    }

    static tel(e) {
        var input = e.target,
            inputNumbersValue = telephoneMask.getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }
}

class inputMask {
    constructor(
        el, type, placeholder
    ) { 
        this.type = type
        this.el = document.querySelector(el)

        let listenFunc = this.listenerGet()
        this.el.addEventListener('input', listenFunc)
        this.el.placeholder = placeholder
        
    }
    listenerGet() {
        this.el.type = this.type
        switch (this.type) {
            case 'email':
                this.el.addEventListener('paste', this.onMailPaste);
                return this.mail;
                
            case 'tel':
                this.el.maxLength = 18
                this.el.addEventListener('keydown', this.onPhoneKeyDown);
                this.el.addEventListener('paste', this.onPhonePaste, false);
                return telephoneMask.tel;
            case 'name':
                return this.name;
        }
    }
    
    mail(e) {
        return;
    }

    name(e) {
        if (e.target.value[0] == ' ') {
            e.target.value = e.target.value.replace(' ', '')
        }
        let start = e.target.selectionStart 
        let text = e.target.value.split(" ")
    
        if (text.length > 3) {      
            text.pop()            
        }
        if (text.length > 0) {
            for (let i = 0; i < text.length; i++) {
                if (text[i]) {
                    text[i] = text[i][0].toUpperCase()  + text[i].substring(1)
                    if (text[i][1]) {
                        text[i] = text[i][0].toUpperCase() + text[i][1].toLowerCase() + text[i].substring(2)
                    }
                }
            }
        }
        e.target.value = text.join(' ')
        e.target.selectionStart = start
        e.target.selectionEnd = start
    }
    onMailPaste(e) {
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/.+@.+\..+/i.test(pastedText)) {
                return;
            } else {
                e.preventDefault();
            }
        }
    }

    onPhonePaste(e) {
        var input = e.target,
            inputNumbersValue = telephoneMask.getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }
    onPhoneKeyDown(e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }
}

