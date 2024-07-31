import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


class NextJSTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.implicitly_wait(10)
        cls.host = "http://localhost:3000"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def setUp(self):
        self.driver.get(self.host)

    def test_homepage_title(self):
        self.assertEqual(self.driver.title, '8by8 Challenge')

    def test_logo_render(self):
        image_element = self.driver.find_element(
            By.XPATH, "//img[@alt='8by8 Logo']")
        src = image_element.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/8by8-logo.a39d7aad.svg"
        self.assertEqual(src, formatted_url)
        

    def test_h1_exists(self):
        h1_rendered = self.driver.find_element(By.TAG_NAME, 'h1')
        self.assertTrue(h1_rendered.is_displayed())
        self.assertEqual(h1_rendered.text,
                         'GET 8 AAPI FRIENDS TO REGISTER TO VOTE IN 8 DAYS')

    def test_locate_button(self):
        button_element = self.driver.find_element(By.TAG_NAME, "button")
        self.assertTrue(button_element.is_displayed())

    def test_section_1_render(self):
        test_section_1 = self.driver.find_element(By.TAG_NAME, 'section')
        section_class = test_section_1.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_1__MMFLM')

    def test_link_tag_content(self):
        link_tag = self.driver.find_element(By.PARTIAL_LINK_TEXT, 'See')
        link_tag.get_attribute('href') == '/why8by8'
        actions = ActionChains(self.driver)
        actions.move_to_element(link_tag)
        actions.click()
        actions.perform()

#   check if the image exists
    def test_image_exists(self):
        image_element = self.driver.find_element(
            By.XPATH, "//img[@alt='yellow curve']")
        src = image_element.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/yellow-curve.0236528a.svg"
        self.assertEqual(src, formatted_url)


#   section_2

    def test_section_2_rendered(self):
        sections = self.driver.find_elements(By.TAG_NAME, "section")
        second_section = sections[1]
        section_class = second_section.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_2__wgjjP')

    def test_image_dispayed(self):
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='why 8by8?']")
        src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-1.a1a22d7f.png&w=640&q=75"
        self.assertEqual(src, formatted_url)

    def test_father_and_daughter_image(self):
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='sign']")
        src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffather-and-daughter-with-sign.1f060e65.png&w=750&q=75"
        self.assertEqual(src, formatted_url)

    # section 3
    def test_section_3_render(self):
        sections = self.driver.find_elements(By.TAG_NAME, "section")
        third_section = sections[2]
        paragraph_text = third_section.text
        section_class = third_section.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_3__AiNEH')
        expected_paragraph = [
            "In 2020, we saw an unprecedented 150% spike in anti-AAPI (Asian American Pacific Islander) hate crimes,",
            "a trend that is already continuing into 2021.",
            "This is both a national and a local problem."
        ]
        joined_paragraph = ' '.join(expected_paragraph).strip()
        joined_incoming_text = ''.join(paragraph_text)
        self.assertEqual(joined_incoming_text, joined_paragraph)
        
        
    

    def test_div_image(self):
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='teal curve']")
        src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/teal-curve.8a426c54.svg"
        self.assertEqual(src, formatted_url)


# section 4
    def test_all_section_4_render(self):
        sections = self.driver.find_elements(By.TAG_NAME, "section")
        third_section = sections[3]
        h2_text = third_section.text
        section_class = third_section.get_attribute("class")
        text = '150% spike in anti-Asian and anti-AAPI hate crimes in 2020'
        styles = 'styles_section_4__h94nS'
        if section_class == styles:
            self.assertEqual(h2_text, text)
        else:
            self.fail(
                f"Expected class 'styles_section_4__h94nS', but got '{section_class}'")

# section 5
    def test_section_5_render(self):
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[4]
        p_text = fifth_section.text
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_5__e7b2k'
        self.assertEqual(section_class, styles)
        expected_sentence =  'We need\nmore aapi\nvoters'
        p_incoming_text = ''.join(p_text)
        self.assertEqual(p_incoming_text, expected_sentence)
        

    def test_image_shown(self):
        image_shown = self.driver.find_element(
            By.XPATH, "//img[@alt='solution?']")
        image_src = image_shown.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-2.06da5b3c.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)

            
    def test_secondary_image(self):
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='mic']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeaker-with-mic-and-sign.e7d8ad09.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)


# section 6 
    def test_section_6_render(self):
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[5]
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_6__4DbyJ'
        self.assertEqual(section_class, styles)
        
   
    def test_target_text_tags(self):
        h2_render = self.driver.find_elements(By.TAG_NAME, 'h2')
        h2_find = h2_render[2]
        h2_text = h2_find.text
        text = "the path to fixing this problem starts with closing the representation gap In Asian-American communities."
        self.assertEqual(h2_text, text)
        h3_elements = self.driver.find_elements(By.TAG_NAME, 'h3')
        expected_texts = [
        'Asian American voter turnout rate has remained Below',
        'Asian-Americans make up',
        'of the population',
        'but only',
        'of Congress is Asian or AAPI'
    ]
      
        # running a for loop on the h3 tag    
        for i, expected_text in enumerate(expected_texts):
            self.assertEqual(h3_elements[i].text, expected_text)
            
        if len(h3_elements) < len(expected_texts):
            self.fail(f"{len(expected_text)} !== {len(h3_elements)}")
        

    
    def test_section_6_divs(self):
        div_content = self.driver.find_elements(By.TAG_NAME, 'div')
        for i in range(len(div_content)):
            div_class = div_content[i].get_attribute("class")
            if div_class == "styles_stat_percentage_container_1__E4Hep":
                div_text = div_content[i].text
                self.assertEqual(div_text, "60%")
            elif div_class == "styles_stat_percentage_container_2__yCM_4":
                self.assertEqual(div_content[i].text, "7%")
            elif div_class == "styles_stat_percentage_container_3__sUpCi":
                self.assertEqual(div_content[i].text, "3%")
            


# test image inside of the div 
    def test_div_image(self):
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='black curve']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/black-curve.49e02ce0.svg"
        self.assertEqual(image_src, formatted_url)

        
    # section_7
    def test_section_7_render(self):
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[6]
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_7__z9IJU'
        self.assertEqual(section_class, styles)
        
    def test_image_speech_bubble(self):
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='we need your help!']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-3.3f2f3c8a.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)
        
    def test_h2_content(self):
        h2_content = self.driver.find_elements(By.TAG_NAME, 'h2')
        h2_locate = h2_content[3]
        h2_text = h2_locate.text
        expected_text = "we're asking everyone to join us in taking the #8by8challenge and registering 8 of their friends to vote in 8 days."
        self.assertEqual(h2_text, expected_text)
        
    def test_button_action(self):
        button_element = self.driver.find_element(By.CSS_SELECTOR, ".btn_gradient.btn_wide.btn_lg")
        if button_element.text == 'TAKE THE CHALLENGE':
            button_element.click()
        else:
            self.fail(f"expected texted TAKE THE CHALLENGE but got {button_element.text}")
        
        
    def test_paragraph_tag(self):
        expected_text = "The 8by8 mission aims to build civic participation and bring awareness to the struggles of AAPI citizens, while encouraging community involvement and investment. Our approach involves working with community, business, and tech leaders to create voter registration solutions that work."
        paragraph_elements = self.driver.find_elements(By.TAG_NAME, 'p')
        locate = False
        for p in paragraph_elements:
            if p.get_attribute("class") == "b2 color_white":
                self.assertEqual(p.text, expected_text)
                locate = True
                break
        
        if not locate:
            self.fail("Expected paragraph with class 'b2 color_white' was not found.")  
            
                
            
    def test_anchor_tag(self):
        a_content = self.driver.find_element(By.TAG_NAME, 'a')
        a_content.get_attribute('href') == '/https://www.8by8.us/'
        actions = ActionChains(self.driver)
        actions.move_to_element(a_content)
        actions.click()
        actions.perform()
        
        
        

      


if __name__ == "__main__":
    unittest.main()
