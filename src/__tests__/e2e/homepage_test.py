"""Runs Selenium tests against the homepage."""
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

class HomePageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up the browser instance before all tests"""
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)
        cls.host = os.environ.get("PREVIEW_URL") or "http://localhost:3000"
        preview_access_token = os.environ.get("ACCESS_TOKEN")
        cls.query_string = "?x-vercel-protection-bypass=" + preview_access_token if preview_access_token else ""

    @classmethod
    def tearDownClass(cls):
        """Close the browser instance after all tests are complete"""
        cls.driver.quit()

    def setUp(self):
        """Navigate to the base URL before each test"""
        self.driver.get(self.host + self.query_string)

    def assertEqualIgnoreCase(self, expected, actual):
        expected_to_lower = expected.lower()
        actual_to_lower = actual.lower()
        if expected_to_lower != actual_to_lower:
            self.fail(f"Expected {expected_to_lower} but got {actual_to_lower}")

    # Webpage Elements  
    def test_homepage_title(self):
        """Test if the homepage title is correct"""
        self.assertEqual(self.driver.title, '8by8 Challenge')

    def test_logo_render(self):
        """Test if the logo image is rendered correctly"""
        image_element = self.driver.find_element(
            By.XPATH, "//img[@alt='8by8 Logo']")
        logo_src = image_element.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/8by8-logo.a39d7aad.svg"
        self.assertEqual(logo_src, formatted_url)

    def test_h1_exists(self):
        """Test if the h1 element is displayed"""
        h1_rendered = self.driver.find_element(By.TAG_NAME, 'h1')
        self.assertTrue(h1_rendered.is_displayed())
        self.assertEqualIgnoreCase('GET 8 AAPI FRIENDS TO REGISTER TO VOTE IN 8 DAYS', h1_rendered.text)

    def test_locate_button(self):
        """Test if the challenge button is displayed correctly"""
        button_element = self.driver.find_element(
            By.CSS_SELECTOR, ".styles_challenge_btn__T0eGB")
        self.assertEqualIgnoreCase('TAKE THE CHALLENGE', button_element.text)
            
    # Hamburger Menu    
    def test_hamburger_menu(self):
        """Test if the hambuger menu functions as intended"""
        prev_state = self.driver.find_element(By.CLASS_NAME, 'hidden').is_selected()
        if not prev_state:
            alter_state = self.driver.find_element(By.CLASS_NAME, 'styles_outer_container__ppLtJ')
            events = ActionChains(self.driver)
            events.move_to_element(alter_state).click().perform()
        else:
            self.fail('Hamburger Menu Tests have failed!')
    
        inner_menu = self.driver.find_element(By.CLASS_NAME, 'styles_inner_container__0JSHj').is_displayed()
        if not inner_menu:
            self.fail('Inner Menu is not displayed!')  

     
    def test_hamburger_menu_items(self):
        """Test if the hambuger menu contains expected items."""
        hamburger_menu_ul = self.driver.find_element(By.CLASS_NAME, 'styles_hamburger_menu_items__8yFBG')

        greeting = hamburger_menu_ul.find_element(By.TAG_NAME, 'h2')
        self.assertEqualIgnoreCase('Hi there!', greeting.get_property('innerText'))

        menu_items = hamburger_menu_ul.find_elements(By.TAG_NAME, 'li')
        text_of_expected_menu_items = (
          "",
          "Take the challenge", 
          "Take action", 
          "Why 8by8",
          "Terms of Service",
          "Privacy Policy",
          "Sign up",
          "Sign in",
        )

        self.assertEqual(len(text_of_expected_menu_items), len(menu_items))

        for i, expected_item_text in enumerate(text_of_expected_menu_items):
            self.assertEqualIgnoreCase(expected_item_text, menu_items[i].get_property('innerText'))
                    
    # SECTION_01
    def test_section_1_render(self):
        """Test if Section 1 is rendered correctly"""
        test_section_1 = self.driver.find_element(By.TAG_NAME, 'section')
        section_class = test_section_1.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_1__MMFLM')

    def test_link_tag(self):
        """Test the link tag content in Section 1"""
        link_tag = self.driver.find_element(By.PARTIAL_LINK_TEXT, 'See')
        self.assertIn('/why8by8', link_tag.get_attribute('href'))

    def test_image_exists(self):
        """Test if the image in Section 1 exists"""
        image_element = self.driver.find_element(
            By.XPATH, "//img[@alt='yellow curve']")
        image_src = image_element.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/yellow-curve.0236528a.svg"
        self.assertEqual(image_src, formatted_url)

    # SECTION_02
    def test_section_2_rendered(self):
        """Test if Section 2 is rendered"""
        sections = self.driver.find_elements(By.TAG_NAME, "section")
        second_section = sections[1]
        section_class = second_section.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_2__wgjjP')

    def test_image_dispayed(self):
        """Test if the main image in Section 2 is displayed"""
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='why 8by8?']")
        src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-1.a1a22d7f.png&w=640&q=75"
        self.assertEqual(src, formatted_url)

    def test_father_and_daughter_image(self):
        """Test if the father_daughter image in Section 2 is displayed"""
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='sign']")
        secondary_src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffather-and-daughter-with-sign.1f060e65.png&w=750&q=75"
        self.assertEqual(secondary_src, formatted_url)
        
    # SECTION_03        
    def test_section_3_render(self):
        """Test if Section 3 is rendered"""
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
        joined_expected = ' '.join(expected_paragraph).strip()
        joined_text = ''.join(paragraph_text)
        self.assertEqual(joined_text, joined_expected)

    def test_div_image(self):
        """Test if the image in the div of Section 3 is displayed correctly"""
        image_displayed = self.driver.find_element(
            By.XPATH, "//img[@alt='teal curve']")
        div_src = image_displayed.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/teal-curve.8a426c54.svg"
        self.assertEqual(div_src, formatted_url)

    # SECTION_04
    def test_all_section_4_render(self):
        """Test if Section 4 is rendered correctly"""
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
    
    # SECTION_05    
    def test_section_5_render(self):
        """Test if Section 5 is rendered """
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[4]
        p_text = fifth_section.text
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_5__e7b2k'
        self.assertEqual(section_class, styles)
        expected_sentence = 'We need\nmore aapi\nvoters'
        p_incoming_text = ''.join(p_text)
        self.assertEqual(p_incoming_text, expected_sentence)

    def test_image_shown(self):
        """Test if the main image in Section 5 is displayed"""
        image_shown = self.driver.find_element(
            By.XPATH, "//img[@alt='solution?']")
        image_src = image_shown.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-2.06da5b3c.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)

    def test_secondary_image(self):
        """Test if the secondary_image in Section 5 is displayed"""
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='mic']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeaker-with-mic-and-sign.e7d8ad09.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)

    # SECTION_06
    def test_section_6_render(self):
        """Test if Section 6 is rendered """
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[5]
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_6__4DbyJ'
        self.assertEqual(section_class, styles)

    def test_target_text_tags(self):
        """Test if the target text for h2 & h3 are displayed"""
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

        for i, expected_text in enumerate(expected_texts):
            self.assertEqual(h3_elements[i].text, expected_text)

        if len(h3_elements) < len(expected_texts):
            self.fail(f"{len(expected_text)} !== {len(h3_elements)}")

    def test_section_6_divs(self):
        """Test if all the divs are displaying correct content"""
        div_elements = self.driver.find_elements(By.TAG_NAME, 'div')
        for div in div_elements:
            div_class = div.get_attribute("class")
            if div_class == "styles_stat_percentage_container_1__E4Hep":
                div_text = div.text
                self.assertEqual(div_text, "60%")
            elif div_class == "styles_stat_percentage_container_2__yCM_4":
                self.assertEqual(div.text, "7%")
            elif div_class == "styles_stat_percentage_container_3__sUpCi":
                self.assertEqual(div.text, "3%")

    def test_div_content(self):
        """Test if the images in the div is getting displayed"""
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='black curve']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/static/media/black-curve.49e02ce0.svg"
        self.assertEqual(image_src, formatted_url)

    # SECTION_07
    def test_section_7_render(self):
        """Test if section_7 is rendered"""
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[6]
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_7__z9IJU'
        self.assertEqual(section_class, styles)

    def test_image_speech_bubble(self):
        """Test if the speech_bubble image is displayed"""
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='we need your help!']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-3.3f2f3c8a.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)

    def test_h2_content(self):
        """Test if expected_text is being rendered"""
        h2_content = self.driver.find_elements(By.TAG_NAME, 'h2')
        h2_locate = h2_content[3]
        h2_text = h2_locate.text
        expected_text = "we're asking everyone to join us in taking the #8by8challenge and registering 8 of their friends to vote in 8 days."
        self.assertEqual(h2_text, expected_text)

    def test_button_action(self):
        """Test if the button functions as expected"""
        button_element = self.driver.find_element(
            By.CSS_SELECTOR, ".btn_gradient.btn_wide.btn_lg")
        if button_element.text.upper() == 'TAKE THE CHALLENGE':
            button_element.click()
        else:
            self.fail(
                f"expected texted TAKE THE CHALLENGE but got {button_element.text}")

    def test_paragraph_tag(self):
        """Test if the p_tag displays all the expected content"""
        expected_text = "The 8by8 mission aims to build civic participation and bring awareness to the struggles of AAPI citizens, while encouraging community involvement and investment. Our approach involves working with community, business, and tech leaders to create voter registration solutions that work."
        paragraph_elements = self.driver.find_elements(By.TAG_NAME, 'p')
        locate = False
        for p in paragraph_elements:
            if p.get_attribute("class") == "b2 color_white":
                self.assertEqual(p.text, expected_text)
                locate = True
                break

        if not locate:
            self.fail(
                "Expected paragraph with class 'b2 color_white' was not found.")

if __name__ == "__main__":
    unittest.main()
