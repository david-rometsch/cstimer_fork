<?php
file_put_contents('/tmp/cstimer_bug.log', date('H:i:s') . ' ' . file_get_contents('php://input') . "\n", FILE_APPEND);
http_response_code(200);
