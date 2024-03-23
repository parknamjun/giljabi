package kr.giljabi.api.controller;

import io.swagger.annotations.ApiOperation;
import kr.giljabi.api.geo.*;
import kr.giljabi.api.service.GoogleService;
import kr.giljabi.api.request.RequestElevationData;
import kr.giljabi.api.response.Response;
import kr.giljabi.api.utils.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Gpx track 정보를 tcx 변환
 *
 * @author eahn.park@gmail.com
 * 2018.10.26 gpx to tcx Project start....
 * 2021.09.17 Spring boot 2.5.4
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class ElevationController {

    private final GoogleService googleService;
    private final ResourceLoader resourceLoader;

    @Value("${giljabi.mountain100.path}")
    private String mountain100Path;


    @PostMapping("/api/1.0/elevation")
    @ApiOperation(value = "고도정보", notes = "google elevation api 이용하여 고도정보를 받아오는 api")
    public Response getElevation(final @Valid @RequestBody RequestElevationData request) {
        ArrayList<Geometry3DPoint> list;
        Response response;
        try {
            if (request.getTrackPoint().size() == 0)
                new Exception("입력된 트랙정보가 없습니다.");

            //tcp socket exception 방지, 개발초기에 간혹 발생했었는데 이제는 이런 문제는 없는듯...
            //googleService.checkGoogle();

            list = googleService.getElevation(request);
            return new Response(list);
            //return getMountainData();
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }
/*
    @GetMapping("/api/1.0/mountain")
    @ApiOperation(value = "국립공원 GPX정보, ", notes = "파일 목록")
    public Response getMountainList() {
        List<String> list = new ArrayList<>();
        StringBuffer sb = new StringBuffer();
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:/kr/*.gpx");
            for (Resource resource : resources) {
                list.add(resource.getFilename());
            }
            return new Response(list);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }

    @GetMapping("/api/1.0/mountain/{filename}")
    @ApiOperation(value = "국립공원 G ", notes = "파일 목록")
    public Response getMountainTrackinfo(@PathVariable String filename) {
        try {
            Resource resource = resourceLoader.getResource("classpath:/kr/" + filename);
            String xmlFile = new String(Files.readAllBytes(Paths.get(resource.getURI())), "UTF-8");
            return new Response(xmlFile);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }
*/

    @GetMapping("/api/1.0/mountain100")
    @ApiOperation(value = "산림청 100대 명산",
            notes = "<h3>한국등산트레킹지원센터_산림청 100대명산</h3><br>" +
                    "산림청 100대명산의 POI(관심지점), 갈림길(방면), 노면정보를 제공하는 GPX 포맷의 공간정보 파일데이터<br>" +
                    "https://www.data.go.kr/data/15098177/fileData.do?recommendDataYn=Y<br>")
    public Response getMountainList100() {
        List<String> list = new ArrayList<>();
        StringBuffer sb = new StringBuffer();
        try {
            String jsonFile = readFileAsString( "100.txt");
            String[] lines = jsonFile.split(System.getProperty("line.separator"));
            for (String line : lines) {
                if(line.charAt(0) == '#')
                    continue;
                list.add(line);
            }
            return new Response(list);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }

    @GetMapping("/api/1.0/mountain100/{filename}")
    @ApiOperation(value = "산림청 100대 명산 이름으로 검색한 gpx 파일 목록")
    public Response getMountainList100Files(@PathVariable String filename) {
        List<String> fileList = new ArrayList<>();
        try {
            File fileDir = new File(mountain100Path);
            String regex = filename + ".*\\.gpx$";

            FileFilter filter = new FileFilter() {
                @Override
                public boolean accept(File pathname) {
                    return pathname.getName().matches(regex);
                }
            };
            File[] files = fileDir.listFiles(filter);

            for (File file : files) {
                fileList.add(file.getName());
            }
            return new Response(fileList);
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }

    public String readFileAsString(String filename) throws IOException {
        String fileFullName = String.format("%s/%s", mountain100Path, filename);
        File file = new File(fileFullName);
        byte[] binaryData = FileCopyUtils.copyToByteArray(file);
        return new String(binaryData, StandardCharsets.UTF_8);
    }

    @GetMapping("/api/1.0/mountain100Gpx/{filename}")
    @ApiOperation(value = "산림청 100대 명산 gpx 파일내용 ")
    public Response getMountainList100Gpxfile(@PathVariable String filename) {
        try {
            return new Response(readFileAsString(filename));
        } catch (Exception e) {
            return new Response(ErrorCode.STATUS_EXCEPTION.getStatus(), e.getMessage());
        }
    }


    private Response getMountainData() {
        Response response = new Response(0, "정상 처리 되었습니다.");
        ArrayList<Geometry3DPoint> data = new ArrayList<>();
        data.add(new Geometry3DPoint(127.013472, 37.953889, 153.4));
        data.add(new Geometry3DPoint(127.045492, 37.921015, 107.4));
        data.add(new Geometry3DPoint(127.114628, 37.912896, 325.3));
        data.add(new Geometry3DPoint(127.162436, 37.974824, 205.6));
        data.add(new Geometry3DPoint(127.139509, 37.984367, 265.8));
        response.setData(data);
        return response;
    }
}
