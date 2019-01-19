package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BaseController {
    @GetMapping("/")
    public String index() {
        return "views/index";
    }

    @GetMapping("/test")
    public String test() {
        return "views/test";
    }

    @GetMapping("/paper")
    public String paper() {
        return "views/paper";
    }

    @GetMapping("/layer")
    public String layer() {
        return "views/layer";
    }

    @GetMapping("/search")
    public String search() {
        return "views/search";
    }
}
