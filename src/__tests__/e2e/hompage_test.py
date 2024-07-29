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
        wait = WebDriverWait(self.driver, 5)
        logo_element = wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//img[@alt='8by8 Logo']")))
        self.assertTrue(logo_element.is_displayed())

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

#   check for the next section aaka section2
#   it wiill be better if we have a child class for each section, that way we are following the lexographical concept of seleinium tests
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
        section_class = third_section.get_attribute("class")
        self.assertEqual(section_class, 'styles_section_3__AiNEH')

#   this will only pass when I get to the [1] p tag because this p tag has no class to identify it so the function runs the entire p tag contnet -- possible solution would be to add a class to this p tag and distinguish it form the other p tag ?
    # def test_paragraph_elements(self):
    #     expected_paragraph = """
    #     In 2020, we saw an unprecedented 150% spike in anti-AAPI (Asian American Pacific Islander) hate crimes, a trend that is already continuing into 2021. This is both a national and a local problem.
    #     The 8by8 mission aims to build civic participation and bring awareness to the struggles of AAPI citizens, while encouraging community involvement and investment. Our approach involves working with community, business, and tech leaders to create voter registration solutions that work.
    #     Copyright © 2021
    #     8BY8 is a nonprofit organization dedicated to stopping hate against Asian American Pacific Islander communities through voter registration and turnout.
    #     """
    #     paragraph_tag = self.driver.find_elements(By.TAG_NAME, 'p')
    #     paragraph_container = ''
    #     for p in paragraph_tag:
    #         paragraph_container = p.text
    #     print(paragraph_container, expected_paragraph)

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
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_5__e7b2k'
        self.assertEqual(section_class, styles)

    def test_image_shown(self):
        image_shown = self.driver.find_element(
            By.XPATH, "//img[@alt='solution?']")
        image_src = image_shown.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeech-bubble-2.06da5b3c.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)


#   h1 cannot be found so need to fix that for section 5 
    # def test_show_h1(self):
    
    def test_secondary_image(self):
        test_image = self.driver.find_element(
            By.XPATH, "//img[@alt='mic']")
        image_src = test_image.get_attribute("src")
        formatted_url = f"{self.host}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspeaker-with-mic-and-sign.e7d8ad09.png&w=640&q=75"
        self.assertEqual(image_src, formatted_url)


# section 6 
    def test_section_6_render(self):
        section = self.driver.find_elements(By.TAG_NAME, "section")
        fifth_section = section[6]
        section_class = fifth_section.get_attribute("class")
        styles = 'styles_section_5__e7b2k'
        self.assertEqual(section_class, styles)
        
   
    
        


if __name__ == "__main__":
    unittest.main()
