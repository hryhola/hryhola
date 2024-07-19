import type { SwipedEvent } from "swiped-events"

export class SectionsScroller {
    readonly sections = [
        'contacts',
        'what-do-I-do',
        'skill-set',
        'experience',
        'education',
        'cv'
    ]

    readonly minSection = 0
    readonly maxSection = this.sections.length - 1

    private currentSection = 0
    private isScrolling = false
    private onWheelHandlerDebounce?: number;

    private containerElement?: HTMLDivElement;
    private sectionsElements?: HTMLDivElement[]

    private getNextSection(isScrollUp: boolean) {
        if (isScrollUp) {
            return this.currentSection - 1
        } else {
            return this.currentSection + 1;
        }
    }

    private isCurrentSectionScrolled(toUp: boolean) {
        if (!this.sectionsElements) {
            console.error('sectionsHTML is not defined!')
            
            return
        }

        const section = this.sectionsElements[this.currentSection]

        if (!section) {
            console.error('Cannot get current section!')

            return false
        }

        if (toUp) {
            return section.scrollTop === 0
        } else {
            return section.scrollHeight - section.scrollTop - section.clientHeight < 1
        }
    }

    private handleScroll(isScrollUp: boolean) {
        if (this.isScrolling || !this.isCurrentSectionScrolled(isScrollUp)) return

        if (typeof this.onWheelHandlerDebounce === 'number') {
            clearTimeout(this.onWheelHandlerDebounce)
        }

        const isScrollDown = !isScrollUp

        this.onWheelHandlerDebounce = setTimeout(() => {
            const forbiddenScrollDown = isScrollDown && this.currentSection === this.maxSection
            const forbiddenScrollUp = isScrollUp && this.currentSection === this.minSection

            if (forbiddenScrollDown || forbiddenScrollUp || !this.isCurrentSectionScrolled(isScrollUp)) {
                return
            }

            this.currentSection = this.getNextSection(isScrollUp)

            this.scrollToCurrentSection()
        }, 50)
    }

    initialize() {
        this.containerElement = document.querySelector('.sections') as HTMLDivElement;
        this.sectionsElements = [...this.containerElement.querySelectorAll('section')] as HTMLDivElement[];

        this.containerElement.addEventListener('transitionend', () => {
            this.isScrolling = false
        })

        document.addEventListener('wheel', (event) => {
            if (event.deltaY === 0 || this.isScrolling) return
    
            this.handleScroll(event.deltaY < 0)
        })

        document.addEventListener('swiped', (e) => {
            const event = e as SwipedEvent
            
            if (event.detail.dir === 'left' || event.detail.dir === 'right') return

            this.handleScroll(event.detail.dir === 'down')
          });
    }

    scrollToHash() {
        const index = this.sections.indexOf(location.hash.substring(1))

        if (index !== -1) {
            this.scrollToSection(index)
        }
    }

    scrollToCurrentSection() {
        if (!this.containerElement) {
            console.error('Sections container is not defined!')
            
            return false
        }

        if (this.currentSection > this.maxSection || this.currentSection < this.minSection) {
            console.error(`Got out of range section: ${this.currentSection}! min: ${this.minSection}, max: ${this.maxSection}`)
            
            return
        }

        const section = this.sections[this.currentSection]

        if (section !== 'contacts') {
            history.pushState({}, '', '#' + section)
        } else {
            history.pushState({}, document.title, window.location.pathname + window.location.search)
        }

        this.containerElement.setAttribute('style', 'top: -' + (this.currentSection * 100) + 'vh')

        this.isScrolling = true
    }

    scrollToSection(number: number) {
        if (number > this.maxSection || number < this.minSection) {
            console.error(`Got out of range section: ${number}! min: ${this.minSection}, max: ${this.maxSection}`)
            
            return
        }

        this.currentSection = number

        this.scrollToCurrentSection()
    }
}

export const scroller = new SectionsScroller()
